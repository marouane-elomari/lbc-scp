export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const customCookie = searchParams.get('datadome');

  const targetUrl = "https://api.leboncoin.fr/finder/search";
  const startTime = Date.now();

  const searchPayload = {
    limit: 10,
    filters: {
      category: { id: "10" }
    }
  };

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'api_key': 'ba44415510123',
    'Referer': 'https://www.leboncoin.fr/',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
  };

  if (customCookie) {
    headers['Cookie'] = `datadome=${customCookie}`;
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(searchPayload)
    });

    const durationMs = Date.now() - startTime;
    const rawTextBody = await response.text();

    // Conversion de tous les en-têtes de réponse en un objet JS simple
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Essai de parsing JSON du body si possible, sinon retour du texte brut
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawTextBody);
    } catch (e) {
      parsedBody = rawTextBody;
    }

    // Retour de la réponse HTTP brute complète
    return new Response(
      JSON.stringify(
        {
          meta: {
            httpStatus: response.status,
            statusText: response.statusText,
            responseTime: `${durationMs}ms`
          },
          rawHeaders: responseHeaders,
          rawBody: parsedBody
        },
        null,
        2
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "FETCH_ERROR",
        message: error.message
      }, null, 2),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
