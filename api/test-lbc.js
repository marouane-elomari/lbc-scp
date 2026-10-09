export default async function handler(request) {
  const targetUrl = "https://www.leboncoin.fr/_next/data/XiXNA9MgsN72zG6vUqUU2/ad/ventes_immobilieres/3217421417.json?cat=ventes_immobilieres&id=3217421417";
  const startTime = Date.now();

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.leboncoin.fr/',
      },
    });

    const durationMs = Date.now() - startTime;
    const textBody = await response.text();

    if (response.ok) {
      // Succès (HTTP 200)
      return new Response(
        JSON.stringify({
          status: "SUCCESS",
          message: "Connexion réussie ! Les données JSON ont été récupérées.",
          httpStatus: response.status,
          responseTime: `${durationMs}ms`,
          preview: textBody.substring(0, 300)
        }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Bloqué ou ERREUR HTTP (403, 404, etc.)
      return new Response(
        JSON.stringify({
          status: "BLOCKED_OR_FAILED",
          message: response.status === 403 
            ? "Accès refusé par DataDome (HTTP 403)."
            : `Le serveur a répondu avec le code HTTP ${response.status}.`,
          httpStatus: response.status,
          responseTime: `${durationMs}ms`,
          isDataDomeHeaderPresent: response.headers.has('x-datadome') || textBody.includes('datadome'),
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
        message: "Erreur lors de la tentative de requête vers LeBonCoin.",
        responseTime: `${durationMs}ms`,
        errorDetail: error.message
      }, null, 2),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
