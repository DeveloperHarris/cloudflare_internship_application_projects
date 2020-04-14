addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const REWRITER = new HTMLRewriter();

/**
 * Respond with equal chance variant 1 or variant 2
 * @param {Request} request
 */
async function handleRequest(request) {
  const URLS = await fetch(
    "https://cfw-takehome.developers.workers.dev/api/variants"
  )
    .then(response => response.json())
    .then(data => data.variants);

  let selectedVariant = await fetch(URLS[Math.round(Math.random())]);

  return REWRITER.transform(selectedVariant);
}
