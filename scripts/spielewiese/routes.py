"""Turn routes.txt into games/weg-routes.js for "Zeichnet den Weg" on the Spielewiese.

Each address is found with OpenStreetMap's Nominatim, each trip is routed the fastest way by car or on
foot on FOSSGIS's OSRM servers, and the names around it come from OpenStreetMap's Overpass API. All are
free and need no key. The game shows the places and names on a map without roads, and the players'
drawing is compared against the route.

    python3 scripts/spielewiese/routes.py
"""
import json
import math
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
ROUTES_TXT = HERE / 'routes.txt'
ROUTE_LIST = HERE.parents[1] / 'docs/public/sarina_und_andreas/games/weg-routes.js'
HEADERS = {'User-Agent': 'nicolasneudeck.com Spielewiese route script'}
OVERPASS = 'https://overpass-api.de/api/interpreter'
ROUTER = 'https://routing.openstreetmap.de/routed-{}/route/v1/driving/'  # with car or foot
# What the map names, by how many km the trip reaches: landmarks around a walk through a village,
# villages around short drives, and only sizeable towns across long ones, as
# (reach, kinds of place, smallest population, landmarks too). A place without a population on
# OpenStreetMap counts as small.
LABELS = (
    (2, ('city', 'town', 'village'), 0, True),
    (8, ('city', 'town', 'village'), 0, False),
    (50, ('city', 'town'), 0, False),
    (math.inf, ('city', 'town'), 20000, False),
)
LANDMARKS = ('"amenity"~"^(place_of_worship|townhall|school)$"', '"railway"~"^(station|halt)$"',
             '"landuse"="cemetery"', '"leisure"="sports_centre"')
SIZES = {'city': 1, 'town': 2, 'village': 3}
LANDMARK = 4  # the size of a landmark's name
# weg.js frames a trip with this share of its reach to spare on each side, then stretches the map to the
# screen, which is between this narrow and this wide (width / height): names are fetched for all of it
FRAME_PAD = 0.35
SCREENS = (0.6, 3)
SIMPLIFY = 0.002  # route points are dropped while the line stays this share of the trip's span from the road
ROAD_SHARE = 0.1  # a road is named in "via" when at least this share of the trip is on it
COORDINATES = re.compile(r'(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)')


def get(url, form=None, tries=5):
    """JSON from one of the free servers, asking again a little later while it is busy."""
    request = urllib.request.Request(url, data=form and urllib.parse.urlencode(form).encode(), headers=HEADERS)
    for wait in (15 * 2 ** n for n in range(tries)):
        try:
            with urllib.request.urlopen(request, timeout=180) as response:
                data = json.load(response)
            break
        except (urllib.error.URLError, TimeoutError) as error:
            if getattr(error, 'code', 503) not in (429, 502, 503, 504) or wait == 15 * 2 ** (tries - 1):
                raise
            print(f'  {urllib.parse.urlsplit(url).hostname} is busy ({error}), trying again in {wait} s')
            time.sleep(wait)
    time.sleep(1.5)  # Nominatim allows one request a second, and the others ask for restraint too
    return data


def locate(address):
    """(lat, lng, what was found) for an address, or for coordinates written as "48.4839, 10.0285"."""
    if written := COORDINATES.fullmatch(address):
        return float(written[1]), float(written[2]), 'coordinates as given'
    found = get('https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode(
        {'q': address, 'format': 'jsonv2', 'limit': 1}))
    if not found:
        sys.exit(f'Nominatim found nothing for "{address}". Check the spelling or give coordinates.')
    return float(found[0]['lat']), float(found[0]['lon']), found[0]['display_name']


def metres(points, lat0):
    """(x, y) in metres for (lat, lng) points; flat enough for a drive across Bavaria."""
    k = math.cos(math.radians(lat0))
    return [(lng * 111320 * k, lat * 110540) for lat, lng in points]


def segment_distance(p, a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    t = 0 if dx == dy == 0 else max(0, min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
    return math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)


def simplify(points, tolerance):
    """The fewest points that keep the line within tolerance metres of its shape (Douglas-Peucker)."""
    xy = metres(points, points[0][0])
    keep = {0, len(points) - 1}
    spans = [(0, len(points) - 1)]
    while spans:
        a, b = spans.pop()
        far, index = max(((segment_distance(xy[i], xy[a], xy[b]), i) for i in range(a + 1, b)), default=(0, None))
        if far > tolerance:
            keep.add(index)
            spans += [(a, index), (index, b)]
    return [points[i] for i in sorted(keep)]


def labels(points):
    """[name, lat, lng, size] for the names on a trip's map, the biggest first and then the nearest to the route."""
    lats, lngs = [lat for lat, _ in points], [lng for _, lng in points]
    lat, lng = (min(lats) + max(lats)) / 2, (min(lngs) + max(lngs)) / 2
    k = math.cos(math.radians(lat))
    wide, high = (max(lngs) - min(lngs)) * k * 110.5, (max(lats) - min(lats)) * 110.5
    _, kinds, smallest, landmarks = next(tier for tier in LABELS if max(wide, high) <= tier[0])
    narrowest, widest = SCREENS
    half_lat = (0.5 + FRAME_PAD) * max(high, wide / narrowest) / 110.5
    half_lng = (0.5 + FRAME_PAD) * max(wide, high * widest) / 110.5 / k
    box = f'({lat - half_lat},{lng - half_lng},{lat + half_lat},{lng + half_lng})'
    query = f'node["place"~"^({"|".join(kinds)})$"]["name"]{box};'
    if landmarks:
        query += ''.join(f'nwr[{tag}]["name"]{box};' for tag in LANDMARKS)
    found = get(OVERPASS, {'data': f'[out:json][timeout:120];({query});out center tags;'})['elements']
    towns = [place['tags']['name'] for place in found if 'place' in place['tags']]
    named = []
    for place in found:
        tags, at = place['tags'], place.get('center', place)
        name = tags['name']
        if 'place' not in tags:
            # "Friedhof Beimerstetten" is just "Friedhof" on a map that names Beimerstetten
            for town in towns:
                name = re.sub(rf'\s*\b{re.escape(town)}\b', '', name).strip()
            if not name:
                continue
        population = int(re.sub(r'\D', '', (re.match(r'\d[\d.,]*', tags.get('population', '')) or [''])[0]) or 0)
        if population >= smallest:
            near = min(math.hypot(at['lat'] - p_lat, (at['lon'] - p_lng) * k) for p_lat, p_lng in points)
            named.append((SIZES.get(tags.get('place'), LANDMARK), -population, near, name, at['lat'], at['lon']))
    kept, seen = [], set()
    for size, _, _, name, lat, lng in sorted(named):
        if size == LANDMARK:
            if name in seen:
                continue  # a landmark can be on OpenStreetMap twice, as a point and as its grounds
            seen.add(name)
        kept.append([name, round(lat, 4), round(lng, 4), size])
    return kept


def roads(steps, total):
    """The roads that carry a good share of the trip, in the order they are taken, like ['A 7', 'A 8']."""
    share = {}
    for step in steps:
        road = (step.get('ref') or step.get('name') or '').split(';')[0].strip()
        if road:
            share[road] = share.get(road, 0) + step['distance'] / total
    return [road for road, part in share.items() if part >= ROAD_SHARE]


def js(text):
    return "'" + text.replace('\\', '\\\\').replace("'", "\\'") + "'"


def main():
    places, trips = {}, []
    for line in ROUTES_TXT.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        head, bar, tail = line.partition('|')
        if '>' in head:
            start, _, goal = head.partition('>')
            title, _, mode = tail.partition('|')
            if mode.strip() not in ('', 'walk'):
                sys.exit(f'A trip ends in "| walk" or nothing, got: {line}')
            trips.append({'from': start.strip(), 'to': goal.strip(), 'title': title.strip(), 'walk': mode.strip() == 'walk'})
        elif '=' in head and bar:
            key, _, name = head.partition('=')
            places[key.strip()] = {'name': name.strip(), 'address': tail.strip()}
        else:
            sys.exit(f'Expected a place "key = Name | Address" or a trip "from > to | Title", got: {line}')
    for trip in trips:
        for end in (trip['from'], trip['to']):
            if end not in places:
                sys.exit(f'The trip "{trip["title"]}" goes from or to "{end}", which is not a place in routes.txt.')

    for place in places.values():
        place['lat'], place['lng'], found = locate(place['address'])
        print(f"✓ {place['name']}: {place['address']}  →  {found}")

    for trip in trips:
        start, goal = places[trip['from']], places[trip['to']]
        route = get(ROUTER.format('foot' if trip['walk'] else 'car') + f"{start['lng']},{start['lat']};"
                    f"{goal['lng']},{goal['lat']}?overview=full&geometries=geojson&steps=true")['routes'][0]
        points = [(lat, lng) for lng, lat in route['geometry']['coordinates']]
        (x0, y0), (x1, y1) = metres([(start['lat'], start['lng']), (goal['lat'], goal['lng'])], start['lat'])
        trip['route'] = simplify(points, SIMPLIFY * math.hypot(x1 - x0, y1 - y0))
        trip['km'] = round(route['distance'] / 1000, 1)
        trip['minutes'] = round(route['duration'] / 60)
        trip['via'] = roads(route['legs'][0]['steps'], route['distance'])
        trip['labels'] = labels(points + [(start['lat'], start['lng']), (goal['lat'], goal['lng'])])
        print(f"✓ {trip['title']}: {trip['km']} km, {trip['minutes']} min, via {', '.join(trip['via']) or '-'}"
              f"  ({len(points)} route points, {len(trip['route'])} kept)")
        print(f"  labels: {', '.join(t[0] for t in trip['labels'][:30])}{' …' if len(trip['labels']) > 30 else ''}"
              f" ({len(trip['labels'])})")

    place_entries = ''.join(
        f"  {js(key)}: {{ name: {js(p['name'])}, lat: {p['lat']:.5f}, lng: {p['lng']:.5f} }},\n"
        for key, p in places.items())
    trip_entries = ''.join(
        f"  {{ from: {js(t['from'])}, to: {js(t['to'])}, title: {js(t['title'])}, walk: {str(t['walk']).lower()}, "
        f"km: {t['km']}, minutes: {t['minutes']}, via: [{', '.join(js(r) for r in t['via'])}],\n    route: ["
        + ',\n      '.join(','.join(f'[{lat:.5f},{lng:.5f}]' for lat, lng in t['route'][i:i + 6])
                           for i in range(0, len(t['route']), 6))
        + '],\n    labels: ['
        + ',\n      '.join(', '.join(f'[{js(n)}, {lat}, {lng}, {size}]' for n, lat, lng, size in t['labels'][i:i + 4])
                           for i in range(0, len(t['labels']), 4))
        + '] },\n' for t in trips)
    ROUTE_LIST.write_text(f'''// weg-routes.js: the places and trips for "Zeichnet den Weg". Written by scripts/spielewiese/routes.py
// from scripts/spielewiese/routes.txt, so edit that list and run the script rather than changing this file.
//
// PLACES maps a key to {{ name, lat, lng }}.
// Trip: {{ from, to, title, walk, km, minutes, via, route, labels }}
//   from and to are keys of PLACES, and walk is true for a trip on foot. route is the fastest way by car,
//   or on foot for a walk, as [lat, lng] points, which the players' drawing is compared against; via names
//   the roads most of it runs on. labels are the names on its map as [name, lat, lng, size], size 1 for a
//   city, 2 a town, 3 a village and 4 a landmark, biggest first.

export const PLACES = {{
{place_entries}}};

export const TRIPS = [
{trip_entries}];
''')
    print(f'Wrote {len(places)} places and {len(trips)} trips to {ROUTE_LIST.relative_to(HERE.parents[1])}.')


if __name__ == '__main__':
    main()
