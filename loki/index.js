addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const URLS = await fetch(
    "https://cfw-takehome.developers.workers.dev/api/variants"
  )
    .then(response => response.json())
    .then(data => data.variants);

  return fetch(URLS[Math.round(Math.random())]);
}
