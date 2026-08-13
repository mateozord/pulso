// Equivalente Netlify do proxy anti-CORS (a versão Vercel está em
// api/ticketmaster/[...path].js — cada plataforma tem seu próprio
// formato de function, então mantemos as duas). O papel é idêntico:
// receber a chamada do navegador, injetar a apikey no servidor,
// repassar pra Ticketmaster.
export async function handler(event) {
  // netlify.toml redireciona /api/ticketmaster/* pra cá, acrescentando
  // o resto do caminho depois de "/ticketmaster/" no próprio event.path
  // — por isso extraímos o endpoint real dali, não do nome da function.
  const path = event.path.split('/ticketmaster/')[1] ?? ''
  const params = event.queryStringParameters || {}

  const url = new URL(`https://app.ticketmaster.com/discovery/v2/${path}`)
  url.searchParams.set('apikey', process.env.TICKETMASTER_API_KEY)

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value)
  }

  try {
    const response = await fetch(url)
    const data = await response.json()
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  } catch {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Não foi possível conectar à Ticketmaster.' }),
    }
  }
}
