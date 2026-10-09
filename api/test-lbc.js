export default async function handler(request) {
  const targetUrl = "https://www.leboncoin.fr/_next/data/XiXNA9MgsN72zG6vUqUU2/ad/ventes_immobilieres/3217421417.json?cat=ventes_immobilieres&id=3217421417";

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.leboncoin.fr/',
      },
    });

    const status = response.status;
    const textBody = await response.text();

    return new Response(
      JSON.stringify({
        success: response.ok,
        httpStatus: status,
        preview: textBody.substring(0, 300)
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
