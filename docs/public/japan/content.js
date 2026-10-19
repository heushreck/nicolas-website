// content.js: everything the Japan page shows. Edit this file to fill in the trip.
//
// Tabs: give a tab `soon: '…'` while it has no content yet; drop `soon` once it has a real panel.
// Groups: { title?, note?, items: [...] }
// Resource items: { kind: 'podcast'|'video'|'film'|'series'|'book', title, titleDe?, by, year, length?, lang?: 'de', blurb, url, poster?, id? }
//   titleDe is the German release title; lang: 'de' marks German-language audio.
//   poster is a portrait image URL (Wikipedia's infobox image works); films, series and books without one get a placeholder.
//   Ticks are stored per item, keyed by kind + title, so renaming an item clears its tick unless you give it a fixed `id`.
//
// The repo is public, so don't put anything private here (addresses, booking codes, ticket PDFs).

export const TABS = [
  { id: 'prepare', label: 'Prepare', jp: '準備' },
  { id: 'route', label: 'Route', jp: '旅程', soon: 'Our route through Japan, city by city, with a map.' },
  { id: 'stays', label: 'Stays', jp: '宿', soon: 'Where we sleep: the Airbnbs and ryokan, with check-in details.' },
  { id: 'sights', label: 'Sights', jp: '名所', soon: 'Temples, gardens, food streets and everything else we want to see, pinned on Google Maps.' },
  { id: 'tickets', label: 'Tickets', jp: '切符', soon: 'Flights, rail passes, and museum and event tickets.' },
];

export const PREPARE = {
  intro: 'Before we go: the history, the companies, the films and the manners that will make Japan make more sense once we land.',
  sections: [
    {
      id: 'listen', jp: '聴く', title: 'Listen', note: 'Podcasts for the commute, the gym or the long flight.', groups: [
        {
          title: 'The Rest Is History · Dawn of the Samurai',
          note: 'The four-part series from April 2026. Listen in order.',
          items: [
            { kind: 'podcast', title: 'Part 1 · The Shadow of the Sword', by: 'The Rest Is History, ep. 658', year: 2026, length: '63 min', blurb: 'Who the samurai really were, and how their myth runs from the Heian court all the way to Meiji.', url: 'https://therestishistory.com/episodes/the-shadow-of-the-sword-part-1' },
            { kind: 'podcast', title: 'Part 2 · Bloodbath at the Bridge', by: 'The Rest Is History, ep. 659', year: 2026, length: '67 min', blurb: 'Taira against Minamoto: how the warrior clans muscled into imperial politics in 1100s Kyoto.', url: 'https://therestishistory.com/episodes/bloodbath-at-the-bridge-part-2' },
            { kind: 'podcast', title: 'Part 3 · Japan’s Greatest Warrior', by: 'The Rest Is History, ep. 660', year: 2026, length: '61 min', blurb: 'Yoshitsune and Benkei, the tragic heroes you’ll keep meeting at shrines and in kabuki.', url: 'https://therestishistory.com/episodes/japan-s-greatest-warrior-part-3' },
            { kind: 'podcast', title: 'Part 4 · The Shōgun Triumphant', by: 'The Rest Is History, ep. 661', year: 2026, length: '65 min', blurb: 'The end of the Genpei War and the Kamakura shogunate: the start of seven centuries of warrior rule.', url: 'https://therestishistory.com/episodes/the-sh-gun-triumphant-part-4' },
          ],
        },
        {
          title: 'The Rest Is History · more Japan',
          items: [
            { kind: 'podcast', title: 'Japan: Samurai and Shoguns', by: 'The Rest Is History, ep. 277', year: 2022, length: '62 min', blurb: 'The best single-episode overview: Japanese history told through six people, from medieval lords to manga.', url: 'https://therestishistory.com/episodes/samurai-and-shoguns' },
            { kind: 'podcast', title: 'Lady Murasaki and the Shining Prince', by: 'The Rest Is History, ep. 560', year: 2025, length: '54 min', blurb: 'The Tale of Genji and Heian Kyoto’s court culture, where Japanese aesthetics begin.', url: 'https://therestishistory.com/episodes/lady-murasaki-and-the-shining-prince-part-1' },
            { kind: 'podcast', title: 'Secrets of the Imperial Court', by: 'The Rest Is History, ep. 561', year: 2025, length: '67 min', blurb: 'The Pillow Book and daily life at court. A great primer before Kyoto’s palaces and temples.', url: 'https://therestishistory.com/episodes/secrets-of-the-imperial-court-part-2' },
          ],
        },
        {
          title: 'Acquired · Japanese companies',
          note: 'Long business histories. Start with Sony.',
          items: [
            { kind: 'podcast', title: 'Sony', by: 'Acquired, S10 E3', year: 2022, length: '3 h 4 min', blurb: 'From a postwar Tokyo startup to the Walkman, PlayStation and a global entertainment empire.', url: 'https://www.acquired.fm/episodes/sony' },
            { kind: 'podcast', title: 'Nintendo’s Origins', by: 'Acquired, S12 E3', year: 2023, length: '3 h 28 min', blurb: 'A Kyoto playing-card maker from 1889 becomes the Famicom company: craft, family and reinvention.', url: 'https://www.acquired.fm/episodes/nintendo' },
            { kind: 'podcast', title: 'Nintendo: The Console Wars', by: 'Acquired, S12 E4', year: 2023, length: '3 h 20 min', blurb: 'Nintendo against Sega and Sony. Pairs nicely with the Sony episode.', url: 'https://www.acquired.fm/episodes/nintendo-the-console-wars' },
            { kind: 'podcast', title: 'ARM & SoftBank', by: 'Acquired, S4 E2', year: 2019, length: '1 h 30 min', blurb: 'Masayoshi Son, SoftBank and the ARM takeover: Japan’s boldest modern tech investor.', url: 'https://www.acquired.fm/episodes/arm-softbank' },
          ],
        },
        {
          title: 'Hardcore History · Supernova in the East',
          note: 'Dan Carlin on Japan’s road into and through the Pacific War. Six free episodes, about 27 hours. Heavy, but unforgettable.',
          items: [
            { kind: 'podcast', title: 'Supernova in the East I', by: 'Dan Carlin, show 62', year: 2018, length: '4 h 28 min', blurb: 'Start here: how a society shaped by centuries of isolation became an expansionist empire.', url: 'https://www.dancarlin.com/product/hardcore-history-62-supernova-in-the-east-i/' },
            { kind: 'podcast', title: 'Supernova in the East II', by: 'Dan Carlin, show 63', year: 2019, length: '4 h 2 min', blurb: 'The war in China, the world’s muted response, and the road to Pearl Harbor.', url: 'https://www.dancarlin.com/product/hardcore-history-63-supernova-in-the-east-ii/' },
            { kind: 'podcast', title: 'Supernova in the East III', by: 'Dan Carlin, show 64', year: 2019, length: '4 h 54 min', blurb: 'Japan’s lightning expansion across Asia and the Pacific, and the war’s merciless turn.', url: 'https://www.dancarlin.com/product/hardcore-history-64-supernova-in-the-east-iii/' },
            { kind: 'podcast', title: 'Supernova in the East IV', by: 'Dan Carlin, show 65', year: 2020, length: '3 h 59 min', blurb: 'Coral Sea, Midway and Guadalcanal: the naval battles that flipped the Pacific war.', url: 'https://www.dancarlin.com/product/hardcore-history-65-supernova-in-the-east-iv/' },
            { kind: 'podcast', title: 'Supernova in the East V', by: 'Dan Carlin, show 66', year: 2020, length: '3 h 33 min', blurb: 'As defeat looms, desperate tactics replace material strength.', url: 'https://www.dancarlin.com/product/hardcore-history-66-supernova-in-the-east-v/' },
            { kind: 'podcast', title: 'Supernova in the East VI', by: 'Dan Carlin, show 67', year: 2021, length: '5 h 46 min', blurb: 'Firebombing, kamikaze and the atomic bombs. Worth hearing before Hiroshima.', url: 'https://www.dancarlin.com/product/hardcore-history-67-supernova-in-the-east-vi/' },
          ],
        },
        {
          title: 'Auf Deutsch',
          note: 'History, food and companies, in German.',
          items: [
            { kind: 'podcast', lang: 'de', title: 'Japan: Der Genpei-Krieg und die Samurai 1180', by: 'Eine Stunde History', year: 2025, length: '43 min', blurb: 'The German companion to Dawn of the Samurai: the same war, in one hour.', url: 'https://www.deutschlandfunknova.de/beitrag/japan-der-genpei-krieg-und-die-samurai-1180' },
            { kind: 'podcast', lang: 'de', title: 'Japan: Die Meiji-Restauration', by: 'Eine Stunde History', year: 2023, length: '43 min', blurb: '1868: how Japan swapped the shogun for an emperor and industrialised at breakneck speed.', url: 'https://www.deutschlandfunknova.de/beitrag/kaiserreich-japan-die-meiji-restauration-1868' },
            { kind: 'podcast', lang: 'de', title: 'Die 47 Ronin', by: 'Geschichten aus der Geschichte, GAG255', year: 2020, length: '59 min', blurb: 'Japan’s great loyalty legend. Their graves at Sengaku-ji in Tokyo are still a pilgrimage site.', url: 'https://www.geschichte.fm/podcast/zs255/' },
            { kind: 'podcast', lang: 'de', title: 'Die Republik Ezo und das Ende des Shogunats', by: 'Geschichten aus der Geschichte, GAG323', year: 2021, length: '50 min', blurb: 'The shogunate’s last stand in Hokkaido and the end of the samurai era.', url: 'https://www.geschichte.fm/archiv/gag323/' },
            { kind: 'podcast', lang: 'de', title: 'Hokusai und die Große Welle', by: 'Geschichten aus der Geschichte, GAG488', year: 2025, blurb: 'The story behind the most famous print in the world.', url: 'https://www.geschichte.fm/archiv/gag488/' },
            { kind: 'podcast', lang: 'de', title: 'Eine kleine Geschichte des Sushi', by: 'Geschichten aus der Geschichte, GAG541', year: 2026, length: '72 min', blurb: 'How fermented fish turned into the sushi we know. Food history for the flight.', url: 'https://www.geschichte.fm/archiv/gag541/' },
            { kind: 'podcast', lang: 'de', title: 'Edo, 1691', by: 'Was bisher geschah', year: 2026, length: '27 min', blurb: 'A short time-travel tour of shogun-era Tokyo, guided by a 17th-century German visitor.', url: 'https://shows.acast.com/was-bisher-geschah/episodes/6a1c023149418f56c4c3936e' },
            { kind: 'podcast', lang: 'de', title: 'Nintendo vs. Sony', by: 'Kampf der Unternehmen', year: 2020, length: '6 parts · 2.5 h', blurb: 'How a Nintendo snub created the PlayStation. The German counterpart to Acquired.', url: 'https://podcasts.apple.com/de/podcast/nintendo-vs-sony-in-den-r%C3%BCcken-gefallen/id1485275017?i=1000499992000' },
            { kind: 'podcast', lang: 'de', title: 'Toyota vs. Honda', by: 'Kampf der Unternehmen', year: 2023, length: '4 parts · 2.8 h', blurb: 'Postwar Japan rebuilt, told through two carmakers.', url: 'https://podcasts.apple.com/de/podcast/toyota-vs-honda-aus-den-tr%C3%BCmmern-auferstanden/id1485275017?i=1000629150191' },
          ],
        },
      ],
    },
    {
      id: 'watch', jp: '見る', title: 'Watch on YouTube', note: 'Short explainers on how Japan became Japan, plus tips for first-timers.', groups: [
        {
          title: 'History',
          items: [
            { kind: 'video', title: 'history of japan', by: 'Bill Wurtz', year: 2016, length: '9 min', blurb: 'All of Japanese history at breakneck speed. Ridiculous, and the names stick.', url: 'https://www.youtube.com/watch?v=Mh5LY4Mz15o' },
            { kind: 'video', title: 'History of the Shogunates and the End of the Shogun', by: 'Kings and Generals', year: 2024, length: '19 min', blurb: 'The Kamakura, Ashikaga and Tokugawa shogunates in one clear animated overview.', url: 'https://www.youtube.com/watch?v=aoczzwyfjkA' },
            { kind: 'video', title: 'Warring States Japan: Sengoku Jidai', by: 'Extra History', year: 2014, length: '6 parts · 9 min each', blurb: 'Nobunaga, Hideyoshi and Ieyasu, the three unifiers behind the castles we’ll visit.', url: 'https://www.youtube.com/watch?v=hDsdkoln59A' },
            { kind: 'video', title: 'End of the Samurai', by: 'Extra History', year: 2025, length: '49 min', blurb: 'Perry’s black ships, the Boshin War and the Meiji reforms, as one film.', url: 'https://www.youtube.com/watch?v=ZWHYS-E7nNg' },
          ],
        },
        {
          title: 'Before we go',
          items: [
            { kind: 'video', title: 'How to Plan Your First Trip to Japan (2026)', by: 'Japan Guide', year: 2026, length: '13 min', blurb: 'Up-to-date logistics: rail passes, IC cards, money and how to split the days.', url: 'https://www.youtube.com/watch?v=2yAr36a7Lmw' },
            { kind: 'video', title: '12 Unspoken Rules Not to Break in Japan', by: 'Abroad in Japan', year: 2024, length: '26 min', blurb: 'Chris Broad’s funny, practical guide to the etiquette visitors most often get wrong.', url: 'https://www.youtube.com/watch?v=i_kYN7f8qUg' },
            { kind: 'video', title: 'How to Eat Japan: 10 Food Tips', by: 'Paolo fromTOKYO', year: 2018, length: '10 min', blurb: 'Ordering and restaurant manners from a long-time Tokyo local. A few details may be dated.', url: 'https://www.youtube.com/watch?v=lbnpo-hZHsQ' },
            { kind: 'video', title: 'What a Typical Tokyo Neighbourhood Is Like', by: 'Life Where I’m From', year: 2021, length: '15 min', blurb: 'A calm walk through ordinary residential Tokyo, away from the tourist spots.', url: 'https://www.youtube.com/watch?v=TheOkz8oF_I' },
          ],
        },
      ],
    },
    {
      id: 'films', jp: '映画', title: 'Films', note: 'A film night list, from Ghibli to the classics.', groups: [
        {
          title: 'Studio Ghibli',
          items: [
            { kind: 'film', title: 'Spirited Away', titleDe: 'Chihiros Reise ins Zauberland', by: 'Hayao Miyazaki', year: 2001, blurb: 'The masterpiece: a girl lost in a bathhouse for Shinto spirits.', url: 'https://en.wikipedia.org/wiki/Spirited_Away',
              poster: 'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png' },
            { kind: 'film', title: 'My Neighbor Totoro', titleDe: 'Mein Nachbar Totoro', by: 'Hayao Miyazaki', year: 1988, blurb: 'Rice fields, forest shrines and a giant fluffy spirit. Pure comfort.', url: 'https://en.wikipedia.org/wiki/My_Neighbor_Totoro',
              poster: 'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg' },
            { kind: 'film', title: 'Princess Mononoke', titleDe: 'Prinzessin Mononoke', by: 'Hayao Miyazaki', year: 1997, blurb: 'An epic clash between iron-making humans and the old forest gods.', url: 'https://en.wikipedia.org/wiki/Princess_Mononoke',
              poster: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Princess_Mononoke_Japanese_poster.png' },
            { kind: 'film', title: 'Kiki’s Delivery Service', titleDe: 'Kikis kleiner Lieferservice', by: 'Hayao Miyazaki', year: 1989, blurb: 'A young witch moves to the city and starts a business. Ghibli at its gentlest.', url: 'https://en.wikipedia.org/wiki/Kiki%27s_Delivery_Service',
              poster: 'https://upload.wikimedia.org/wikipedia/en/0/07/Kiki%27s_Delivery_Service_%28Movie%29.jpg' },
            { kind: 'film', title: 'Grave of the Fireflies', titleDe: 'Die letzten Glühwürmchen', by: 'Isao Takahata', year: 1988, blurb: 'Two children in firebombed Kobe. Devastating, and central to how Japan remembers the war.', url: 'https://en.wikipedia.org/wiki/Grave_of_the_Fireflies',
              poster: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Grave_of_the_Fireflies_Japanese_poster.jpg' },
            { kind: 'film', title: 'The Boy and the Heron', titleDe: 'Der Junge und der Reiher', by: 'Hayao Miyazaki', year: 2023, blurb: 'Miyazaki’s Oscar-winning late film about grief and growing up in wartime.', url: 'https://en.wikipedia.org/wiki/The_Boy_and_the_Heron',
              poster: 'https://upload.wikimedia.org/wikipedia/en/4/41/How_Do_You_Live_poster.jpg' },
          ],
        },
        {
          title: 'Classics',
          items: [
            { kind: 'film', title: 'Seven Samurai', titleDe: 'Die sieben Samurai', by: 'Akira Kurosawa', year: 1954, blurb: 'Samurai, peasants and duty. The template for half of all action films since.', url: 'https://en.wikipedia.org/wiki/Seven_Samurai',
              poster: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Seven_Samurai_Poster.png' },
            { kind: 'film', title: 'Tokyo Story', titleDe: 'Die Reise nach Tokyo', by: 'Yasujirō Ozu', year: 1953, blurb: 'Ageing parents visit their busy children in postwar Tokyo. Quiet and enormous.', url: 'https://en.wikipedia.org/wiki/Tokyo_Story',
              poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Tokyo_monogatari_poster.jpg/330px-Tokyo_monogatari_poster.jpg' },
            { kind: 'film', title: 'Tampopo', by: 'Jūzō Itami', year: 1985, blurb: 'A “ramen western” about Japan’s food obsession. Watch it hungry.', url: 'https://en.wikipedia.org/wiki/Tampopo',
              poster: 'https://upload.wikimedia.org/wikipedia/en/0/00/Tampopo_-_Poster.jpg' },
            { kind: 'film', title: 'Shall We Dance?', by: 'Masayuki Suo', year: 1996, blurb: 'A buttoned-up salaryman secretly takes ballroom lessons. Warm and funny about conformity.', url: 'https://en.wikipedia.org/wiki/Shall_We_Dance%3F_(1996_film)',
              poster: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Shall_We_Dansu.jpg' },
          ],
        },
        {
          title: 'Modern Japan',
          items: [
            { kind: 'film', title: 'Lost in Translation', by: 'Sofia Coppola', year: 2003, blurb: 'Two jet-lagged strangers adrift in Tokyo. Exactly how the first night will feel.', url: 'https://en.wikipedia.org/wiki/Lost_in_Translation',
              poster: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Lost_in_Translation_poster.jpg' },
            { kind: 'film', title: 'Perfect Days', by: 'Wim Wenders', year: 2023, blurb: 'A Tokyo toilet cleaner’s quiet routine. A meditation on small pleasures, and Tokyo’s designer public toilets.', url: 'https://en.wikipedia.org/wiki/Perfect_Days',
              poster: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Perfect_Days_poster.jpg' },
            { kind: 'film', title: 'Departures', titleDe: 'Nokan – Die Kunst des Ausklangs', by: 'Yōjirō Takita', year: 2008, blurb: 'A cellist becomes an undertaker. Oscar winner about ritual and how Japan honours its dead.', url: 'https://en.wikipedia.org/wiki/Departures_(2008_film)',
              poster: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Okuribito_%282008%29.jpg' },
            { kind: 'film', title: 'Shoplifters', titleDe: 'Shoplifters – Familienbande', by: 'Hirokazu Kore-eda', year: 2018, blurb: 'A makeshift family on Tokyo’s margins. Palme d’Or winner.', url: 'https://en.wikipedia.org/wiki/Shoplifters_(film)',
              poster: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Shoplifters_%28film%29.jpg' },
            { kind: 'film', title: 'Still Walking', by: 'Hirokazu Kore-eda', year: 2008, blurb: 'One family’s memorial day: food, obligation and everything left unsaid.', url: 'https://en.wikipedia.org/wiki/Still_Walking',
              poster: 'https://upload.wikimedia.org/wikipedia/en/b/be/Still_Walking_%28film%29_POSTER.png' },
            { kind: 'film', title: 'Drive My Car', by: 'Ryūsuke Hamaguchi', year: 2021, blurb: 'A slow, Oscar-winning Murakami adaptation about grief, mostly set in Hiroshima.', url: 'https://en.wikipedia.org/wiki/Drive_My_Car_(film)',
              poster: 'https://upload.wikimedia.org/wikipedia/en/3/3d/Drive_My_Car_movie_poster.jpeg' },
            { kind: 'film', title: 'Your Name', titleDe: 'Your Name. – Gestern, heute und für immer', by: 'Makoto Shinkai', year: 2016, blurb: 'A Tokyo boy and a country girl swap bodies. Its real locations still draw fans.', url: 'https://en.wikipedia.org/wiki/Your_Name',
              poster: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png' },
            { kind: 'film', title: 'Godzilla Minus One', by: 'Takashi Yamazaki', year: 2023, blurb: 'Postwar trauma and rebuilding, told through Japan’s most famous monster.', url: 'https://en.wikipedia.org/wiki/Godzilla_Minus_One',
              poster: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Godzilla_Minus_One_Poster.jpeg' },
            { kind: 'film', title: 'Jiro Dreams of Sushi', titleDe: 'Jiro und das beste Sushi der Welt', by: 'David Gelb', year: 2011, blurb: 'Documentary about a sushi master’s lifelong pursuit of perfection: the shokunin spirit.', url: 'https://en.wikipedia.org/wiki/Jiro_Dreams_of_Sushi',
              poster: 'https://upload.wikimedia.org/wikipedia/en/4/47/Jiro_sushi_poster.jpg' },
          ],
        },
      ],
    },
    {
      id: 'series', jp: 'ドラマ', title: 'Series', note: 'For when one film isn’t enough.', groups: [{
        items: [
          { kind: 'series', title: 'Shōgun', by: 'FX / Disney+', year: 2024, blurb: 'Power politics in 1600, mostly in Japanese. Record-breaking Emmy winner; season 2 is on the way.', url: 'https://en.wikipedia.org/wiki/Sh%C5%8Dgun_(2024_TV_series)',
            poster: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Sh%C5%8Dgun_%282024_miniseries%29_poster.jpg' },
          { kind: 'series', title: 'Midnight Diner: Tokyo Stories', by: 'Netflix', year: '2016–2019', blurb: 'A tiny late-night diner in Shinjuku; each episode is built around one humble dish.', url: 'https://en.wikipedia.org/wiki/Midnight_Diner_(Japanese_TV_series)',
            poster: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Midnight_Diner_%28Japanese_TV_series%29.jpg' },
          { kind: 'series', title: 'The Makanai: Cooking for the Maiko House', by: 'Hirokazu Kore-eda, Netflix', year: 2023, blurb: 'Kyoto’s maiko apprentices and the cook who feeds them. Gentle and gorgeous food.', url: 'https://en.wikipedia.org/wiki/The_Makanai:_Cooking_for_the_Maiko_House',
            poster: 'https://upload.wikimedia.org/wikipedia/en/1/11/Kiyo_In_Kyoto.jpg' },
          { kind: 'series', title: 'Tokyo Vice', by: 'HBO Max', year: '2022–2024', blurb: 'An American reporter, the yakuza and the police in 1990s Tokyo. Stylish crime drama.', url: 'https://en.wikipedia.org/wiki/Tokyo_Vice_(TV_series)' },
          { kind: 'series', title: 'Old Enough!', by: 'Nippon TV, Netflix', year: 2022, blurb: 'Toddlers run their first errands alone. Shows how much Japan trusts kids and neighbours.', url: 'https://en.wikipedia.org/wiki/Old_Enough!' },
          { kind: 'series', title: 'Terrace House: Boys & Girls in the City', by: 'Fuji TV, Netflix', year: 2015, blurb: 'Low-key reality TV that quietly reveals the unwritten rules of politeness.', url: 'https://en.wikipedia.org/wiki/Terrace_House:_Boys_%26_Girls_in_the_City' },
        ],
      }],
    },
    {
      id: 'read', jp: '読む', title: 'Read', note: 'A few books for the plane.', groups: [{
        items: [
          { kind: 'book', title: 'Convenience Store Woman', by: 'Sayaka Murata', year: 2016, blurb: 'A short, funny, slightly unsettling novel about fitting in, set in a Tokyo konbini.', url: 'https://en.wikipedia.org/wiki/Convenience_Store_Woman',
            poster: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Konbini_ningen_%28Murata_novel%29.png' },
          { kind: 'book', title: 'In Praise of Shadows', by: 'Jun’ichirō Tanizaki', year: 1933, blurb: 'A slim essay on Japanese aesthetics: lacquer, paper screens, dim light. Changes how you see a temple.', url: 'https://en.wikipedia.org/wiki/In_Praise_of_Shadows',
            poster: 'https://upload.wikimedia.org/wikipedia/en/d/d4/In_praise_of_shadows.jpg' },
          { kind: 'book', title: 'The Book of Tea', by: 'Okakura Kakuzō', year: 1906, blurb: 'The tea ceremony as a way into Zen, simplicity and the Japanese idea of beauty.', url: 'https://en.wikipedia.org/wiki/The_Book_of_Tea',
            poster: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Title_page_of_The_Book_of_Tea.jpg/330px-Title_page_of_The_Book_of_Tea.jpg' },
          { kind: 'book', title: 'Norwegian Wood', by: 'Haruki Murakami', year: 1987, blurb: 'Murakami’s most straightforward novel: love and loss in late-1960s Tokyo.', url: 'https://en.wikipedia.org/wiki/Norwegian_Wood_(novel)',
            poster: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Norwegian_Wood_%28novel%29_%28Book_Cover%29.jpeg' },
          { kind: 'book', title: 'Shōgun', by: 'James Clavell', year: 1975, blurb: 'The doorstopper behind the series: an English pilot shipwrecked in 1600 Japan.', url: 'https://en.wikipedia.org/wiki/Sh%C5%8Dgun_(novel)',
            poster: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Shogun.jpg' },
          { kind: 'book', title: 'Hiroshima', by: 'John Hersey', year: 1946, blurb: 'Six survivors’ accounts of the bomb. Short, and essential before visiting the Peace Memorial.', url: 'https://en.wikipedia.org/wiki/Hiroshima_(book)',
            poster: 'https://upload.wikimedia.org/wikipedia/en/e/e6/HiroshimaBook.jpg' },
        ],
      }],
    },
  ],
  etiquette: [
    { title: 'Shoes off', text: 'Where there’s a step up at the entrance (homes, ryokan, some temples and restaurants), shoes come off. Toilet slippers stay in the toilet.' },
    { title: 'No tipping', text: 'Service is included and a tip can cause confusion. A sincere thank-you is enough.' },
    { title: 'Quiet on trains', text: 'No phone calls, and keep voices low. Queue at the marked spots on the platform.' },
    { title: 'Chopsticks', text: 'Never stand them upright in rice or pass food from chopstick to chopstick: both are funeral rites.' },
    { title: 'Onsen', text: 'Wash thoroughly before getting in, no swimwear, and the small towel stays out of the water. Some baths turn away tattoos, so check first.' },
    { title: 'Carry cash and your rubbish', text: 'Small places are often cash-only, and public bins are rare, so bring a coin purse and a bag for trash.' },
    { title: 'Escalators', text: 'Stand on the left in Tokyo and on the right in Osaka.' },
    { title: 'Eating on the go', text: 'Walking while eating is frowned upon in many places. Finish your snack by the stall or konbini.' },
  ],
  phrases: [
    { ja: 'こんにちは', romaji: 'konnichiwa', meaning: 'Hello' },
    { ja: 'ありがとうございます', romaji: 'arigatō gozaimasu', meaning: 'Thank you (polite)' },
    { ja: 'すみません', romaji: 'sumimasen', meaning: 'Excuse me / sorry, also to call a waiter' },
    { ja: 'お願いします', romaji: 'onegaishimasu', meaning: 'Please (when asking for something)' },
    { ja: 'これをください', romaji: 'kore o kudasai', meaning: 'This one, please' },
    { ja: 'いくらですか', romaji: 'ikura desu ka', meaning: 'How much is it?' },
    { ja: 'トイレはどこですか', romaji: 'toire wa doko desu ka', meaning: 'Where is the toilet?' },
    { ja: '英語のメニューはありますか', romaji: 'eigo no menyū wa arimasu ka', meaning: 'Do you have an English menu?' },
    { ja: 'いただきます', romaji: 'itadakimasu', meaning: 'Said before eating' },
    { ja: 'ごちそうさまでした', romaji: 'gochisōsama deshita', meaning: 'Thanks for the meal (after eating)' },
    { ja: '乾杯', romaji: 'kanpai', meaning: 'Cheers!' },
  ],
};
