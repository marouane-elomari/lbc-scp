export async function GET(request) {
  const targetUrl = "https://api.leboncoin.fr/finder/search";
  const startTime = Date.now();

  // Filtres de recherche (ex: locations immobilières)
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
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      body: JSON.stringify(searchPayload)
    });

    const durationMs = Date.now() - startTime;
    const textBody = await response.text();

    if (response.ok) {
      const data = JSON.parse(textBody);
      return new Response(
        JSON.stringify({
          status: "SUCCESS",
          message: "Succès sans cookie DataDome !",
          httpStatus: response.status,
          responseTime: `${durationMs}ms`,
          totalAds: data.total || 0,
          adsPreview: data.ads ? data.ads.slice(0, 2) : []
        }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          status: "BLOCKED_OR_FAILED",
          message: `Échec sans cookie (HTTP ${response.status}).`,
          httpStatus: response.status,
          responseTime: `${durationMs}ms`,
          preview: textBody.substring(0, 300)
        }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    const durationMs = Date.now() - startTime;
    return new Response(
      JSON.stringify({
        status: "NETWORK_ERROR",
        message: error.message,
        responseTime: `${durationMs}ms`
      }, null, 2),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
