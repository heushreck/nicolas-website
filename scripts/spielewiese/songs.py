"""Turn songs.txt into games/song-list.js for "Wie heißt der Song?" on the Spielewiese.

Each song is looked up in Apple's iTunes Search API, which is free and needs no key. The game plays
Apple's 30-second preview of it, and other well-known songs by the same artist become wrong answers.

    python3 scripts/spielewiese/songs.py
"""
import json
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
SONGS_TXT = HERE / 'songs.txt'
SONG_LIST = HERE.parents[1] / 'docs/public/sarina_und_andreas/games/song-list.js'
STORE = 'DE'  # the German Apple Music storefront
DECOYS = 6  # wrong answers kept per artist

# Apple's titles carry extras like "(feat. Weekend)" or "(Radio Edit)"; the game shows them without
EXTRAS = re.compile(r'\s*[(\[](?:feat\.?|ft\.?|with|radio edit|single version|remaster)[^)\]]*[)\]]'
                    r'|\s+-\s+(?:radio edit|single version|remaster).*$', re.I)
FEAT = re.compile(r'[(\[](?:feat\.?|ft\.?)\s*([^)\]]+)[)\]]', re.I)
ARTIST_JOINS = re.compile(r'\s+(?:feat\.?|ft\.?|&|x|und|and|with)\s+|,', re.I)


def get(endpoint, **params):
    query = urllib.parse.urlencode({**params, 'country': STORE})
    with urllib.request.urlopen(f'https://itunes.apple.com/{endpoint}?{query}', timeout=20) as response:
        data = json.load(response)
    time.sleep(3)  # Apple allows about 20 requests a minute
    return [r for r in data['results'] if r.get('wrapperType') == 'track' and r.get('previewUrl')]


def plain(text):
    """Lower case, without accents or punctuation, for comparing titles."""
    text = ''.join(c for c in unicodedata.normalize('NFKD', text.casefold()) if not unicodedata.combining(c))
    return ' '.join(re.sub(r'[^\w\s]', ' ', text).split())


def clean(title):
    return EXTRAS.sub('', title).strip()


def is_variant(title):
    """A live, acoustic, remixed or otherwise alternative recording, which never makes a good decoy."""
    return bool(re.search(r'[(\[]| - ', clean(title)))


def find(artist, title, pinned):
    """Apple's track for one line of songs.txt, and whether it needs a second look."""
    if pinned:
        found = get('lookup', id=pinned)
        if not found:
            sys.exit(f'Apple has no song with ID {pinned} ({artist} - {title}).')
        return found[0], False
    term = f"{ARTIST_JOINS.sub(' ', artist)} {title}"
    results = get('search', term=term, entity='song', limit=25)
    by_artist = [r for r in results if plain(ARTIST_JOINS.split(artist)[0]) in plain(r['artistName'])]
    exact = [r for r in by_artist if plain(clean(r['trackName'])) == plain(title)]
    if exact:
        return exact[0], False
    if not results:
        sys.exit(f'Apple found nothing for "{artist} - {title}". Check the spelling or pin an ID.')
    return (by_artist or results)[0], True


def decoys(artist_id, taken):
    """The artist's best-known songs that aren't in the list, in Apple's order."""
    titles, seen = [], set(taken)
    for r in get('lookup', id=artist_id, entity='song', limit=100):
        title = clean(r['trackName'])
        if r['artistId'] != artist_id or is_variant(r['trackName']) or '*' in title or plain(title) in seen:
            continue
        seen.add(plain(title))
        titles.append(title)
        if len(titles) == DECOYS:
            break
    return titles


def js(text):
    return "'" + text.replace('\\', '\\\\').replace("'", "\\'") + "'"


def main():
    wanted = []
    for line in SONGS_TXT.read_text().splitlines():
        line = re.sub(r'\s*[(\[]official[^)\]]*[)\]]', '', line.strip(), flags=re.I)
        if not line or line.startswith('#'):
            continue
        song, _, pinned = line.partition('|')
        artist, dash, title = song.partition(' - ')
        if not dash:
            sys.exit(f'Expected "Artist - Title", got: {line}')
        wanted.append((artist.strip(), title.strip(), pinned.strip()))

    songs, unsure_count = [], 0
    for artist, title, pinned in wanted:
        track, unsure = find(artist, title, pinned)
        unsure_count += unsure
        feat = FEAT.search(track['trackName'])
        songs.append({
            'id': track['trackId'],
            'artistId': track['artistId'],
            'artist': track['artistName'] + (f' feat. {feat[1].strip()}' if feat else ''),
            'title': clean(track['trackName']),
        })
        print(f"{'?' if unsure else '✓'} {artist} - {title}  →  {track['artistName']} - {track['trackName']}"
              f"  ({track['collectionName']}, {track['releaseDate'][:4]}, ID {track['trackId']})")

    taken = {plain(s['title']) for s in songs}
    by_artist = {}
    for s in songs:
        if s['artistId'] not in by_artist:
            by_artist[s['artistId']] = decoys(s['artistId'], taken)
            print(f"  decoys by {s['artist'].split(' feat. ')[0]}: {', '.join(by_artist[s['artistId']]) or 'none'}")
        s['decoys'] = by_artist[s['artistId']]

    entries = ''.join(
        f"  {{ id: {s['id']}, artist: {js(s['artist'])}, title: {js(s['title'])},\n"
        f"    decoys: [{', '.join(js(d) for d in s['decoys'])}] }},\n" for s in songs)
    SONG_LIST.write_text(f'''// song-list.js: the songs for "Wie heißt der Song?". Written by scripts/spielewiese/songs.py from
// scripts/spielewiese/songs.txt, so edit that list and run the script rather than changing this file.
//
// Song: {{ id, artist, title, decoys }}
//   id is the song's Apple Music ID; the game fetches its 30-second preview and cover from Apple.
//   decoys are other songs by the same artist, offered as wrong answers.

export const SONGS = [
{entries}];
''')
    print(f'Wrote {len(songs)} songs to {SONG_LIST.relative_to(HERE.parents[1])}.')
    if unsure_count:
        print(f'{unsure_count} marked ? had no exact match: check them, and pin an ID in songs.txt if one is wrong.')


if __name__ == '__main__':
    main()
