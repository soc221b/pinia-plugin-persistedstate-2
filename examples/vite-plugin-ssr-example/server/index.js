const path = require('path')

const compression = require('compression')
const express = require('express')
const { renderPage } = require('vite-plugin-ssr')

const isProduction = process.env.NODE_ENV === 'production'
const root = path.resolve(__dirname, '..')

startServer()

async function startServer() {
  const app = express()

  app.use(compression())

  if (isProduction) {
    const sirv = require('sirv')
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = require('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      cookie: req.headers.cookie,
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType).send(body)
  })

  const port = isProduction ? 4173 : 5173
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
