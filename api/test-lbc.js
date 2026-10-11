//fuck datadom GRRRRRRR
export async function GET(request) {
  const targetUrl = "https://api.leboncoin.fr/finder/search";
  const startTime = Date.now();

  // Payload de recherche minimale
  const searchPayload = {
    limit: 10,
    filters: {
      category: { id: "10" } // 10 = Locations
    }
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'api_key': 'ba44415510123',
        'Referer': 'https://www.leboncoin.fr/',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q
