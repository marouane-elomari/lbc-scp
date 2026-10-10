export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const customCookie = searchParams.get('datadome');

  const targetUrl = "https://api.leboncoin.fr/finder/search";
  const startTime = Date.now();

  // 1. Détection de la signature TLS (JA3) de Vercel
  let tlsAnalysis = null;
  try {
    const tlsCheck = await fetch("https://tls.browserleaks.com/json");
    tlsAnalysis = await tlsCheck.json();
  } catch (e) {
    tlsAnalysis = { error: "Impossible de récupérer l'empreinte TLS" };
  }

  // 2. Détection de l'IP publique Vercel
  let vercelPublicIp = tlsAnalysis?.ip || "Unknown";

  // 3. Payload de recherche
  const searchPayload = {
    limit: 10,
    filters: {
      category: { id: "10" }
    }
  };

  // 4. En-têtes HTTP sortants
  const requestHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'api_key': 'ba44415510123',
    'Referer': 'https://www.leboncoin.fr/',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
  };

  if (customCookie) {
    requestHeaders['Cookie'] = `datadome=${customCookie}`;
  }

  try {
    // 5. Exécution de la requête vers LeBonCoin
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(searchPayload)
    });

    const durationMs = Date.now() - startTime;
    const rawResponseBody = await response.text();

    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let parsedResponseBody;
    try {
      parsedResponseBody = JSON.parse(rawResponseBody);
    } catch (e) {
      parsedResponseBody = rawResponseBody;
    }

    // 6. Rapport complet incluant l'empreinte TLS/JA3
    const detailedReport = {
      tls_fingerprint_captured: {
        ja3_hash: tlsAnalysis?.ja3_hash || "N/A",
        tls_version: tlsAnalysis?.tls_version || "N/A",
        ciphers_list: tlsAnalysis?.ciphers || "N/A",
        extensions_list: tlsAnalysis?.extensions || "N/A",
        curves_list: tlsAnalysis?.curves || "N/A",
        note: "C'est ce hash JA3 précis que DataDome voit arriver sur ses serveurs."
      },
      architecture_context: {
        runtime: `Node.js ${process.version}`,
        vercel_region: process.env.VERCEL_REGION || "Local / Unknown",
        outbound_public_ip: vercelPublicIp
      },
      outgoing_request: {
        method: "POST",
        target_url: targetUrl,
        headers_sent: requestHeaders,
        body_sent: searchPayload
      },
      incoming_response: {
        status_code: response.status,
        status_text: response.statusText,
        execution_time: `${durationMs} ms`,
        headers_received: responseHeaders,
        datadome_action_code: response.headers.get('x-dd-b') || "None",
        datadome_session_cid: response.headers.get('x-datadome-cid') || "None",
        body_received: parsedResponseBody
      }
    };

    return new Response(
      JSON.stringify(detailedReport, null, 2),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: true,
        message: error.message,
        stack: error.stack
      }, null, 2),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
