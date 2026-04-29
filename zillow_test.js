const url = "https://www.zillow.com/homes/123-Main-St-Atlanta-GA_rb/";
fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" } })
  .then(res => res.text())
  .then(html => {
    const match = html.match(/<meta property="og:image" content="([^"]+)"/);
    console.log(match ? match[1] : "No image found");
  })
  .catch(console.error);
