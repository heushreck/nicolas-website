// leaflet.js: loads the Leaflet map library once, for the games that show a map.
const LEAFLET = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/';

let leaflet = null;
export function loadLeaflet() {
  return leaflet ??= new Promise((resolve, reject) => {
    document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: `${LEAFLET}leaflet.css` }));
    document.head.append(Object.assign(document.createElement('script'), { src: `${LEAFLET}leaflet.js`, onload: () => resolve(window.L), onerror: reject }));
  }).catch(error => {
    leaflet = null; // the next game start tries again
    throw error;
  });
}
