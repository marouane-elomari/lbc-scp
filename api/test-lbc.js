export async function GET(request) {
  const DATADOME_COOKIE = "sKpIG5jJf3Qr7ClEvGOI6H1_vWI2BSSrqR0tpkXAw2aziBo3swW7n0p9dwxeot2CjLRjvOH~fIUP5YB3E4Ew_8UJERBwKeFjYHwvJXC8rZpQIlK9EBISP8wjz52SGl5_";

  const targetUrl = "https://www.leboncoin.fr/_next/data/XiXNA9MgsN72zG6vUqUU2/ad/ventes_immobilieres/3217421417.json?cat=ventes_immobilieres&id=3217421417";
  const startTime = Date.now();

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.leboncoin.fr/',
        'Cookie': `datadome=${DATADOME_COOKIE}`,
      },
    });

    const durationMs = Date.now() - startTime;
    const textBody = await response.text();

    if (response.ok) {
      return new Response(
        JSON.stringify({
          status: "SUCCESS",
          message: "Le test avec le cookie DataDome a fonctionné !",
          httpStatus: response.status,
          responseTime: `${durationMs}ms`,
          preview: textBody.substring(0, 300)
        }, null, 2),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          status: "BLOCKED_OR_FAILED",
          message: `Échec malgré le cookie (HTTP ${response.status}).`,
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
