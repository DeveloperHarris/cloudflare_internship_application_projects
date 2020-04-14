addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const REWRITER = new HTMLRewriter().on("p#description", {
  element: e =>
    e.setInnerContent(
      "A cookie is being stored on your browser to always bring you back to this variant."
    )
});

/**
 * Respond with equal chance variant 1 or variant 2
 * @param {Request} request
 */
async function handleRequest(request) {
  // Fetch initial variant list
  const URLS = await fetch(
    "https://cfw-takehome.developers.workers.dev/api/variants"
  )
    .then(response => response.json())
    .then(data => data.variants);

  // Cookie handling & variant selection
  let cookies = request.headers.get("Cookie");
  let variantCookieIndex = cookies.search("selectedVariant=");

  let response;

  if (variantCookieIndex) {
    response = await fetch(URLS[cookies[variantCookieIndex + 16]]);
  } else {
    let randomNum = Math.round(Math.random()); // Returns 0 or 1

    response = await fetch(URLS[randomNum]);

    response = new Response(response.body, response);
    response.headers.set("Set-Cookie", "selectedVariant=" + randomNum);
  }

  // Return response after being parsed through HTMLRewriter
  return REWRITER.transform(response);
}
