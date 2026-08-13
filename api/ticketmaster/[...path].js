// Equivalente de produção do proxy que existe em vite.config.js pra
// desenvolvimento. O motivo é o mesmo: a Ticketmaster Discovery API
// não autoriza CORS, então o navegador não pode chamá-la direto — e
// aproveitamos pra manter a apikey só aqui, no servidor, nunca no
// código que roda no navegador. Vercel trata qualquer arquivo dentro
// de /api como uma function; o nome [...path].js faz de conta
// "capturar tudo" que vier depois de /api/ticketmaster/.
export default async function handler(req, res) {
  const { path = [], ...params } = req.query
  const endpoint = Array.isArray(path) ? path.join('/') : path

  const url = new URL(`https://app.ticketmaster.com/discovery/v2/${endpoint}`)
  url.searchParams.set('apikey', process.env.TICKETMASTER_API_KEY)

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && value !== '') {
      url.searchParams.set(key, value)
    }
  }

  let response
  try {
    response = await fetch(url)
  } catch {
    res.status(502).json({ error: 'Não foi possível conectar à Ticketmaster.' })
    return
  }

  const data = await response.json()
  res.status(response.status).json(data)
}
