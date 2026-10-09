export async function GET(request) {
  // Définition des paramètres de la requête
  const targetUrl = "https://www.leboncoin.fr/_next/data/XiXNA9MgsN72zG6vUqUU2/ad/ventes_immobilieres/3217421417.json?cat=ventes_immobilieres&id=3217421417";
  const startTime = Date.now();

  // Dictionnaire des en-têtes et cookies
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://www.leboncoin.fr/',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    // Injection des cookies sous forme de chaîne formatée
    'Cookie': [
      'datadome=AYYWdrRbl2K~mSOdx33F_Xj474VqVVhDvukPZb1PEXRw1VSOx6U~jnJ_cX5CWrfY1McnkaATc~sWbKXYagoJr4s03lhCeC_2i_1wZTknrnUqprlM7YAETkNU37vc1Lro',
      'didomi_token=123456' // Exemple d'autres cookies si nécessaire
    ].join('; ')
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: headers,
    });

    const durationMs = Date.now() - startTime;
    const textBody = await response.text();

    if (response.ok) {
      return new Response(
        JSON.stringify({
          status: "SUCCESS",
          message: "Données récupérées avec succès.",
          httpStatus: response.status,
          responseTime: `${durationMs}ms`,
          dataPreview: textBody.substring(0, 300)
        }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          status: "BLOCKED_OR_FAILED",
          message: `Réponse du serveur hôte : HTTP ${response.status}`,
          httpStatus: response.status,
          responseTime: `${durationMs}ms`,
          isDataDomePresent: response.headers.has('x-datadome') || textBody.includes('datadome'),
          bodyPreview: textBody.substring(0, 300)
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
