// content.js: everything the Japan page shows. Edit this file to fill in the trip.
//
// Tabs: give a tab `soon: '…'` while it has no content yet; drop `soon` once it has a real panel.
// Prepare is a grid of categories; each category opens into rows that scroll sideways.
//   Category: { id, jp, title, art, tint, unit, note, rows: [{ title, note?, items }] }
//   Podcast:  { kind: 'podcast', title, by, year, length?, lang?: 'de', spotify?, cover?, url }
//             spotify is the episode id from open.spotify.com/episode/<id>; cover is its artwork.
//             Without spotify the card links to url instead.
//   Video:    { kind: 'video', title, by, year, length?, youtube }  (youtube is the video id)
//   Film:     { kind: 'film' | 'series', title, titleDe?, by, year, blurb, url, poster? }
//             titleDe is the German release title; poster is a portrait image URL.
// Ticks are stored per item, keyed by kind + title, so renaming an item clears its tick
// unless you give it a fixed `id`.
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
  intro: 'Before we go: the history, the companies, the films and the manners that will make Japan make more sense once we land. Pick a corner and tick things off as we go.',
  categories: [
    {
      id: 'listen', jp: '聴く', title: 'Podcasts', art: 'listen', tint: '#fbe9ec', unit: 'episodes',
      note: 'For the commute, the gym or the long flight.',
      rows: [
        {
          title: 'The Rest Is History · Dawn of the Samurai',
          note: 'The four-part series. Listen in order.',
          items: [
            { kind: 'podcast', title: 'Part 1 · The Shadow of the Sword', by: 'The Rest Is History', year: 2026, length: '63 min', url: 'https://therestishistory.com/episodes/the-shadow-of-the-sword-part-1',
              spotify: '5FbmWKSPHRh7uEa4tSgYeM', cover: 'https://i.scdn.co/image/ab6772ab000015bedccbf8bd4a997cbb97a5d465' },
            { kind: 'podcast', title: 'Part 2 · Bloodbath at the Bridge', by: 'The Rest Is History', year: 2026, length: '67 min', url: 'https://therestishistory.com/episodes/bloodbath-at-the-bridge-part-2',
              spotify: '4qcSEcDyUr0RXoD7kJ51lt', cover: 'https://i.scdn.co/image/ab6772ab000015becbee804ee69a23af846a9798' },
            { kind: 'podcast', title: 'Part 3 · Japan’s Greatest Warrior', by: 'The Rest Is History', year: 2026, length: '61 min', url: 'https://therestishistory.com/episodes/japan-s-greatest-warrior-part-3',
              spotify: '6YhIPfcOuijY1l0Ix6tf5t', cover: 'https://i.scdn.co/image/ab6772ab000015befc0c42421d8ea6b3250f630c' },
            { kind: 'podcast', title: 'Part 4 · The Shōgun Triumphant', by: 'The Rest Is History', year: 2026, length: '65 min', url: 'https://therestishistory.com/episodes/the-sh-gun-triumphant-part-4',
              spotify: '4geeOEJlXyqJs0GaB2Xjx4', cover: 'https://i.scdn.co/image/ab6772ab000015be3181a25f448bd89bf2047e0e' },
          ],
        },
        {
          title: 'The Rest Is History · more Japan',
          items: [
            { kind: 'podcast', title: 'Japan: Samurai and Shoguns', by: 'The Rest Is History', year: 2022, length: '62 min', url: 'https://therestishistory.com/episodes/samurai-and-shoguns',
              spotify: '6lXNuHjCcti2YSPF2AF19Q', cover: 'https://i.scdn.co/image/ab67656300005f1fa6b1c980e35b9e510ecdeb44' },
            { kind: 'podcast', title: 'Lady Murasaki and the Shining Prince', by: 'The Rest Is History', year: 2025, length: '54 min', url: 'https://therestishistory.com/episodes/lady-murasaki-and-the-shining-prince-part-1',
              spotify: '5Ional8yBiATI8633ohWNx', cover: 'https://i.scdn.co/image/ab6772ab000015be64eb6f7398f87446d6a7053c' },
            { kind: 'podcast', title: 'Secrets of the Imperial Court', by: 'The Rest Is History', year: 2025, length: '67 min', url: 'https://therestishistory.com/episodes/secrets-of-the-imperial-court-part-2',
              spotify: '38WEqi3Yg4AeIfUzqBaDQ6', cover: 'https://i.scdn.co/image/ab6772ab000015be7bb89cdd8dbaa04e4c26c07d' },
          ],
        },
        {
          title: 'Acquired · Japanese companies',
          note: 'Long business histories. Start with Sony.',
          items: [
            { kind: 'podcast', title: 'Sony', by: 'Acquired', year: 2022, length: '3 h 4 min', url: 'https://www.acquired.fm/episodes/sony',
              spotify: '191UKETU2H8XGSYqJJsTZO', cover: 'https://i.scdn.co/image/ab67656300005f1ff9bd7049cea88c23693d1d1d' },
            { kind: 'podcast', title: 'Nintendo’s Origins', by: 'Acquired', year: 2023, length: '3 h 28 min', url: 'https://www.acquired.fm/episodes/nintendo',
              spotify: '5Pe6juMsSbnI5VAxWgys8y', cover: 'https://i.scdn.co/image/ab67656300005f1ff9bd7049cea88c23693d1d1d' },
            { kind: 'podcast', title: 'Nintendo: The Console Wars', by: 'Acquired', year: 2023, length: '3 h 20 min', url: 'https://www.acquired.fm/episodes/nintendo-the-console-wars',
              spotify: '44DKfqgkXGGhHtZPdXtKlJ', cover: 'https://i.scdn.co/image/ab67656300005f1ff9bd7049cea88c23693d1d1d' },
            { kind: 'podcast', title: 'ARM & SoftBank', by: 'Acquired', year: 2019, length: '1 h 30 min', url: 'https://www.acquired.fm/episodes/arm-softbank',
              spotify: '0rI11KF2OVKLzuljc179xt', cover: 'https://i.scdn.co/image/ab67656300005f1ff9bd7049cea88c23693d1d1d' },
          ],
        },
        {
          title: 'Hardcore History · Supernova in the East',
          note: 'Japan’s road into and through the Pacific War. About 27 hours, heavy but unforgettable.',
          items: [
            { kind: 'podcast', title: 'Supernova in the East I', by: 'Dan Carlin', year: 2018, length: '4 h 28 min', url: 'https://www.dancarlin.com/product/hardcore-history-62-supernova-in-the-east-i/',
              spotify: '2lqNevhLx08QPmvCLjhS4g', cover: 'https://i.scdn.co/image/ab67656300005f1f68bff9eb1131efaa2db182ec' },
            { kind: 'podcast', title: 'Supernova in the East II', by: 'Dan Carlin', year: 2019, length: '4 h 2 min', url: 'https://www.dancarlin.com/product/hardcore-history-63-supernova-in-the-east-ii/',
              spotify: '1lkQ10FIzzATYqr2TCtXow', cover: 'https://i.scdn.co/image/ab67656300005f1fd0b48ec41e2b7618d57c625d' },
            { kind: 'podcast', title: 'Supernova in the East III', by: 'Dan Carlin', year: 2019, length: '4 h 54 min', url: 'https://www.dancarlin.com/product/hardcore-history-64-supernova-in-the-east-iii/',
              spotify: '0EfH5ab5tffoTI8GIUyWSa', cover: 'https://i.scdn.co/image/ab67656300005f1f78a88da9670948bacc3a3ced' },
            { kind: 'podcast', title: 'Supernova in the East IV', by: 'Dan Carlin', year: 2020, length: '3 h 59 min', url: 'https://www.dancarlin.com/product/hardcore-history-65-supernova-in-the-east-iv/',
              spotify: '26vJ74LfG4fpeYJOsp3nKT', cover: 'https://i.scdn.co/image/ab67656300005f1f7426c0ec5ff3ec7cd46fd413' },
            { kind: 'podcast', title: 'Supernova in the East V', by: 'Dan Carlin', year: 2020, length: '3 h 33 min', url: 'https://www.dancarlin.com/product/hardcore-history-66-supernova-in-the-east-v/',
              spotify: '0JyPFxeMC3sZCT1qssDGqB', cover: 'https://i.scdn.co/image/ab67656300005f1f1bf627349fa8a6f2eeb20e78' },
            { kind: 'podcast', title: 'Supernova in the East VI', by: 'Dan Carlin', year: 2021, length: '5 h 46 min', url: 'https://www.dancarlin.com/product/hardcore-history-67-supernova-in-the-east-vi/',
              spotify: '19XDKv5ZtfQJpRv3R61liH', cover: 'https://i.scdn.co/image/ab67656300005f1fc67d102a774858f8356d448e' },
          ],
        },
        {
          title: 'Auf Deutsch',
          note: 'History, art, food and companies, in German.',
          items: [
            { kind: 'podcast', lang: 'de', title: 'Die 47 Ronin', by: 'Geschichten aus der Geschichte', year: 2020, length: '59 min', url: 'https://www.geschichte.fm/podcast/zs255/',
              spotify: '4VHECyzkXpF72EHMxIlhOm', cover: 'https://i.scdn.co/image/ab67656300005f1f03bcd98520bd401f682eae45' },
            { kind: 'podcast', lang: 'de', title: 'Die Republik Ezo und das Ende des Shogunats', by: 'Geschichten aus der Geschichte', year: 2021, length: '50 min', url: 'https://www.geschichte.fm/archiv/gag323/',
              spotify: '55INRbxYgsGoEpk5en4WzW', cover: 'https://i.scdn.co/image/ab67656300005f1f271845631b8d4c99e358918f' },
            { kind: 'podcast', lang: 'de', title: 'Hokusai und die Große Welle', by: 'Geschichten aus der Geschichte', year: 2025, url: 'https://www.geschichte.fm/archiv/gag488/',
              spotify: '2qbnOfXhNDkgLD5LnIPppu', cover: 'https://i.scdn.co/image/ab67656300005f1ff391b0b2df2cda94ed0ca9a4' },
            { kind: 'podcast', lang: 'de', title: 'Eine kleine Geschichte des Sushi', by: 'Geschichten aus der Geschichte', year: 2026, length: '72 min', url: 'https://www.geschichte.fm/archiv/gag541/',
              spotify: '3GDk0VZZ28gunOZz2Y9L6y', cover: 'https://i.scdn.co/image/ab67656300005f1f8a528c4b49ca3fdc10bf10fa' },
            { kind: 'podcast', lang: 'de', title: 'Nintendo vs. Sony', by: 'Kampf der Unternehmen', year: 2020, length: '6 parts', url: 'https://podcasts.apple.com/de/podcast/nintendo-vs-sony-in-den-r%C3%BCcken-gefallen/id1485275017?i=1000499992000',
              spotify: '3q85pDjBDfddITcwTUZ3rZ', cover: 'https://i.scdn.co/image/ab67656300005f1f9a1a3e7df3839732962d8f28' },
          ],
        },
      ],
    },
    {
      id: 'watch', jp: '見る', title: 'YouTube', art: 'watch', tint: '#e6eef6', unit: 'videos',
      note: 'Short explainers on how Japan became Japan, plus tips for first-timers. They play right here.',
      rows: [
        {
          title: 'History',
          items: [
            { kind: 'video', title: 'history of japan', by: 'Bill Wurtz', year: 2016, length: '9 min', youtube: 'Mh5LY4Mz15o' },
            { kind: 'video', title: 'History of the Shogunates and the End of the Shogun', by: 'Kings and Generals', year: 2024, length: '19 min', youtube: 'aoczzwyfjkA' },
            { kind: 'video', title: 'Warring States Japan: Sengoku Jidai', by: 'Extra History', year: 2014, length: 'Part 1 of 6', youtube: 'hDsdkoln59A' },
            { kind: 'video', title: 'End of the Samurai', by: 'Extra History', year: 2025, length: '49 min', youtube: 'ZWHYS-E7nNg' },
          ],
        },
        {
          title: 'Before we go',
          items: [
            { kind: 'video', title: 'How to Plan Your First Trip to Japan (2026)', by: 'Japan Guide', year: 2026, length: '13 min', youtube: '2yAr36a7Lmw' },
            { kind: 'video', title: '12 Unspoken Rules Not to Break in Japan', by: 'Abroad in Japan', year: 2024, length: '26 min', youtube: 'i_kYN7f8qUg' },
            { kind: 'video', title: 'How to Eat Japan: 10 Food Tips', by: 'Paolo fromTOKYO', year: 2018, length: '10 min', youtube: 'lbnpo-hZHsQ' },
            { kind: 'video', title: 'What a Typical Tokyo Neighbourhood Is Like', by: 'Life Where I’m From', year: 2021, length: '15 min', youtube: 'TheOkz8oF_I' },
          ],
        },
      ],
    },
    {
      id: 'films', jp: '映画', title: 'Films & series', art: 'films', tint: '#f8efd6', unit: 'titles',
      note: 'A film night list, from Ghibli to the classics.',
      rows: [
        {
          title: 'Studio Ghibli',
          items: [
            { kind: 'film', title: 'Spirited Away', titleDe: 'Chihiros Reise ins Zauberland', by: 'Hayao Miyazaki', year: 2001, blurb: 'The masterpiece: a girl lost in a bathhouse for Shinto spirits.', url: 'https://en.wikipedia.org/wiki/Spirited_Away',
              poster: 'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png' },
            { kind: 'film', title: 'My Neighbor Totoro', titleDe: 'Mein Nachbar Totoro', by: 'Hayao Miyazaki', year: 1988, blurb: 'Rice fields, forest shrines and a giant fluffy spirit. Pure comfort.', url: 'https://en.wikipedia.org/wiki/My_Neighbor_Totoro',
              poster: 'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg' },
            { kind: 'film', title: 'Princess Mononoke', titleDe: 'Prinzessin Mononoke', by: 'Hayao Miyazaki', year: 1997, blurb: 'An epic clash between iron-making humans and the old forest gods.', url: 'https://en.wikipedia.org/wiki/Princess_Mononoke',
              poster: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Princess_Mononoke_Japanese_poster.png' },
          ],
        },
        {
          title: 'Modern Japan',
          items: [
            { kind: 'film', title: 'Lost in Translation', by: 'Sofia Coppola', year: 2003, blurb: 'Two jet-lagged strangers adrift in Tokyo. Exactly how the first night will feel.', url: 'https://en.wikipedia.org/wiki/Lost_in_Translation',
              poster: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Lost_in_Translation_poster.jpg' },
            { kind: 'film', title: 'Perfect Days', by: 'Wim Wenders', year: 2023, blurb: 'A Tokyo toilet cleaner’s quiet routine: a meditation on small pleasures.', url: 'https://en.wikipedia.org/wiki/Perfect_Days',
              poster: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Perfect_Days_poster.jpg' },
            { kind: 'film', title: 'Your Name', titleDe: 'Your Name. – Gestern, heute und für immer', by: 'Makoto Shinkai', year: 2016, blurb: 'A Tokyo boy and a country girl swap bodies. Its real locations still draw fans.', url: 'https://en.wikipedia.org/wiki/Your_Name',
              poster: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png' },
            { kind: 'film', title: 'Shoplifters', titleDe: 'Shoplifters – Familienbande', by: 'Hirokazu Kore-eda', year: 2018, blurb: 'A makeshift family on Tokyo’s margins. Palme d’Or winner.', url: 'https://en.wikipedia.org/wiki/Shoplifters_(film)',
              poster: 'https://upload.wikimedia.org/wikipedia/en/c/c9/Shoplifters_%28film%29.jpg' },
            { kind: 'film', title: 'Departures', titleDe: 'Nokan – Die Kunst des Ausklangs', by: 'Yōjirō Takita', year: 2008, blurb: 'A cellist becomes an undertaker. Oscar winner about ritual and how Japan honours its dead.', url: 'https://en.wikipedia.org/wiki/Departures_(2008_film)',
              poster: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Okuribito_%282008%29.jpg' },
            { kind: 'film', title: 'Jiro Dreams of Sushi', titleDe: 'Jiro und das beste Sushi der Welt', by: 'David Gelb', year: 2011, blurb: 'Documentary about a sushi master’s lifelong pursuit of perfection.', url: 'https://en.wikipedia.org/wiki/Jiro_Dreams_of_Sushi',
              poster: 'https://upload.wikimedia.org/wikipedia/en/4/47/Jiro_sushi_poster.jpg' },
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
          ],
        },
        {
          title: 'Series',
          items: [
            { kind: 'series', title: 'Shōgun', by: 'FX / Disney+', year: 2024, blurb: 'Power politics in 1600, mostly in Japanese. Record-breaking Emmy winner.', url: 'https://en.wikipedia.org/wiki/Sh%C5%8Dgun_(2024_TV_series)',
              poster: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Sh%C5%8Dgun_%282024_miniseries%29_poster.jpg' },
            { kind: 'series', title: 'Midnight Diner: Tokyo Stories', by: 'Netflix', year: '2016–2019', blurb: 'A tiny late-night diner in Shinjuku; each episode is built around one humble dish.', url: 'https://en.wikipedia.org/wiki/Midnight_Diner_(Japanese_TV_series)',
              poster: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Midnight_Diner_%28Japanese_TV_series%29.jpg' },
            { kind: 'series', title: 'The Makanai: Cooking for the Maiko House', by: 'Netflix', year: 2023, blurb: 'Kyoto’s maiko apprentices and the cook who feeds them. Gentle and gorgeous food.', url: 'https://en.wikipedia.org/wiki/The_Makanai:_Cooking_for_the_Maiko_House',
              poster: 'https://upload.wikimedia.org/wikipedia/en/1/11/Kiyo_In_Kyoto.jpg' },
          ],
        },
      ],
    },
    {
      id: 'manners', jp: '作法', title: 'Manners & words', art: 'manners', tint: '#e5eedc',
      note: 'The small things that make a big difference once we’re there.',
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
