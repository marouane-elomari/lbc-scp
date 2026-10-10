export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const customCookie = searchParams.get('datadome');

  const targetUrl = "https://api.leboncoin.fr/finder/search";
  const startTime = Date.now();

  // 1. Récupération de l'IP publique Vercel
  let vercelPublicIp = "Unknown";
  try {
    const ipCheck = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipCheck.json();
    vercelPublicIp = ipData.ip;
  } catch (e) {
    vercelPublicIp = "Failed to retrieve IP";
  }

  // 2. Payload de recherche
  const searchPayload = {
    limit: 10,
    filters: {
      category: { id: "10" }
    }
  };

  // 3. En-têtes HTTP sortants
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
    // 4. Appel de l'API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(searchPayload)
    });

    const durationMs = Date.now() - startTime;
    const rawResponseBody = await response.text();

    // 5. Extraction de tous les en-têtes HTTP entrants
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

    // 6. Rapport de diagnostic
    const detailedReport = {
      architecture_context: {
        runtime: `Node.js ${process.version}`,
        vercel_region: process.env.VERCEL_REGION || "Local / Unknown",
        outbound_public_ip: vercelPublicIp,
        ip_type_note: "Adresse IP appartenant aux plages AWS/Vercel (classée Datacenter par DataDome)."
      },
      outgoing_request: {
        method: "POST",
        target_url: targetUrl,
        headers_sent: requestHeaders,
        body_sent: searchPayload,
        tls_fingerprint_note: "La poignée de main TLS (JA3/JA4) est exécutée au niveau 4 par la pile OpenSSL de Node.js."
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
