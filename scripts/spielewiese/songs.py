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
DECOYS = 6  # wrong answers kept per song

# Apple's titles carry extras like "(feat. Weekend)", "[Radio Mix]", "(2020)" or "(2015 Remaster)"; the game
# shows them without
EXTRAS = re.compile(r'\s*[(\[][^)\]]*\b(?:feat|ft|with|from|radio (?:edit|mix)|single version|remaster(?:ed)?)\b'
                    r'[^)\]]*[)\]]|\s*\(\d{4}\)|\s+-\s+[^-]*\b(?:radio edit|single version|remaster(?:ed)?)\b.*$', re.I)
VARIANT = re.compile(r'\b(?:live|\w*mix|acoustic|akustik|instrumental|karaoke|demo|version|session|unplugged|edit|'
                     r'intro|outro|medley)\b', re.I)
FEAT = re.compile(r'[(\[](?:feat\.?|ft\.?)\s*([^)\]]+)[)\]]', re.I)
ARTIST_JOINS = re.compile(r'\s+(?:feat\.?|ft\.?|&|x|und|and|with)\s+|,', re.I)

# Words and letters that mark a title as German, English or French. A song's language is read from its
# title, or from the artist's other titles when its own doesn't tell, so wrong answers can match it.
LANGUAGE_WORDS = {
    'de': set('''der das und ich du nicht ein eine einen mit auf für ist wir ihr uns dich mich mir dir mein meine dein
                deine wenn wie auch kein keine nur noch nie immer alles zu im zum vom aus nach über bist sind wird
                nacht liebe leben herz tag tage welt zeit'''.split()),
    'en': set('''the you your i i'm me my and to of is it on be love don't can't we all with for this that what when
                baby oh yeah night girl boy one get let down up just like never ever time heart world day'''.split()),
    'fr': set('''le la les je tu il elle et pas des un une est mon ma ton ta que qui avec pour dans au aux sur
                amour nuit coeur'''.split()),
}
LANGUAGE_LETTERS = {'de': 'äöüß', 'fr': 'éèêàçùâîô'}


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
    return bool(re.search(r'[(\[]| - ', clean(title)) or VARIANT.search(clean(title)))


def language(titles):
    """'de', 'en' or 'fr' for the language most of these titles are in, or '' when they don't tell."""
    score = dict.fromkeys(LANGUAGE_WORDS, 0)
    for title in titles:
        text = title.casefold().replace('’', "'")
        for lang, words in LANGUAGE_WORDS.items():
            score[lang] += sum(word in words for word in re.findall(r"[\w']+", text))
        for lang, letters in LANGUAGE_LETTERS.items():
            score[lang] += sum(text.count(c) for c in letters)
    best = max(score, key=score.get)
    return best if score[best] else ''


def find(artist, title, pinned):
    """Apple's track for one line of songs.txt, and whether it needs a second look."""
    if pinned:
        found = get('lookup', id=pinned)
        if not found:
            sys.exit(f'Apple has no song with ID {pinned} ({artist} - {title}).')
        return found[0], False
    term = f"{ARTIST_JOINS.sub(' ', artist)} {title}"
    results = get('search', term=term, entity='song', limit=25)
    lead = plain(ARTIST_JOINS.split(artist)[0])
    # recordings by the artist asked for, those where they lead first (not a cover that features them)
    by_artist = sorted((r for r in results if lead in plain(r['artistName'])),
                       key=lambda r: not plain(r['artistName']).startswith(lead))
    # the title as given, or the title with a subtitle Apple adds, like "(Who Loves Me)"
    named = [r for r in by_artist if plain(clean(r['trackName'])).startswith(plain(title))]
    best = ([r for r in named if plain(clean(r['trackName'])) == plain(title)]
            or [r for r in named if not VARIANT.search(clean(r['trackName']))])
    if best:
        return best[0], False
    if not results:
        sys.exit(f'Apple found nothing for "{artist} - {title}". Check the spelling or pin an ID.')
    return (by_artist or results)[0], True


def catalog(artist_id):
    """The artist's songs, best known first, without alternative recordings or repeats."""
    titles, seen = [], set()
    for r in get('lookup', id=artist_id, entity='song', limit=100):
        title = clean(r['trackName'])
        if r['artistId'] != artist_id or is_variant(r['trackName']) or '*' in title or plain(title) in seen:
            continue
        seen.add(plain(title))
        titles.append(title)
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
    catalogs = {}
    for s in songs:
        if s['artistId'] not in catalogs:
            catalogs[s['artistId']] = catalog(s['artistId'])
        titles = catalogs[s['artistId']]
        # the song's own title decides its language when it can, otherwise the artist's titles do
        s['lang'] = language([s['title']]) or language(titles)
        s['decoys'] = [t for t in titles if plain(t) not in taken and language([t]) in (s['lang'], '')][:DECOYS]
        print(f"  {s['title']} [{s['lang'] or '?'}]  decoys: {', '.join(s['decoys']) or 'none'}")

    entries = ''.join(
        f"  {{ id: {s['id']}, artist: {js(s['artist'])}, title: {js(s['title'])}, lang: {js(s['lang'])},\n"
        f"    decoys: [{', '.join(js(d) for d in s['decoys'])}] }},\n" for s in songs)
    SONG_LIST.write_text(f'''// song-list.js: the songs for "Wie heißt der Song?". Written by scripts/spielewiese/songs.py from
// scripts/spielewiese/songs.txt, so edit that list and run the script rather than changing this file.
//
// Song: {{ id, artist, title, lang, decoys }}
//   id is the song's Apple Music ID; the game fetches its 30-second preview and cover from Apple.
//   lang is the language of the title ('de', 'en', 'fr', or '' if unclear); wrong answers match it.
//   decoys are other songs by the same artist in that language, offered as wrong answers.

export const SONGS = [
{entries}];
''')
    print(f'Wrote {len(songs)} songs to {SONG_LIST.relative_to(HERE.parents[1])}.')
    if unsure_count:
        print(f'{unsure_count} marked ? had no exact match: check them, and pin an ID in songs.txt if one is wrong.')


if __name__ == '__main__':
    main()
