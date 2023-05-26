import express from 'express'
import { Express } from 'express'
import router from './router'
import session from 'express-session'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { setupSwagger } from './swagger'

const app: Express = express()
const port = 4000
app.use(
  cors({
    credentials: true
  })
)

// app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
setupSwagger(app)
// const server = http.createServer(app)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
app.use('/', router())
