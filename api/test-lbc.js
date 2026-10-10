export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const customCookie = searchParams.get('datadome');

  const targetUrl = "https://api.leboncoin.fr/finder/search";
  const startTime = Date.now();

  const searchPayload = {
    limit: 10,
    filters: {
      category: { id: "10" } // 10 = Locations
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
    const textBody = await response.text();

    // Extraction des en-têtes de diagnostic DataDome
    const ddbHeader = response.headers.get('x-dd-b');
    const datadomeHeader = response.headers.get('x-datadome');
    const setCookieHeader = response.headers.get('set-cookie');

    // Interprétation du code x-dd-b
    let ddbExplanation = "Non présent / Non défini";
    if (ddbHeader === '1') {
      ddbExplanation = "1 (Block) - Anomalie détectée dans les en-têtes ou la session.";
    } else if (ddbHeader === '2') {
      ddbExplanation = "2 (Hard Block) - IP bloquée (réputation IP Datacenter/Vercel).";
    } else if (ddbHeader === '3') {
      ddbExplanation = "3 (Device Check) - Détection liée à l'empreinte navigateur/matérielle.";
    } else if (ddbHeader === '259') {
      ddbExplanation = "259 (Device Check Invisible) - Contrôle d'empreinte en arrière-plan.";
    }

    if (response.ok) {
      let data = {};
      try {
        data = JSON.parse(textBody);
      } catch (e) {
        data = { raw: textBody.substring(0, 200) };
      }

      return new Response(
        JSON.stringify({
          status: "SUCCESS",
          httpStatus: response.status,
          responseTime: `${durationMs}ms`,
          dataDomeDiagnostic: {
            'x-dd-b': ddbHeader,
            'x-dd-b-explanation': ddbExplanation,
            'x-datadome': datadomeHeader,
            'hasSetCookie': !!setCookieHeader
          },
          totalAds: data.total || 0,
          adsPreview: data.ads ? data.ads.slice(0, 2) : []
        }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          status: "BLOCKED_OR_FAILED",
          httpStatus: response.status,
          responseTime: `${durationMs}ms`,
          dataDomeDiagnostic: {
            'x-dd-b': ddbHeader,
            'x-dd-b-explanation': ddbExplanation,
            'x-datadome': datadomeHeader,
            'setCookieHeader': setCookieHeader || null
          },
          bodyPreview: textBody.substring(0, 300)
        }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "ERROR",
        message: error.message
      }, null, 2),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
