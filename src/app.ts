import express from 'express'
import { Express } from 'express'
import router from './router'
import session from 'express-session'
// import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { sessionsHandler } from './controller/auth'
// import { setupSwagger } from './swagger'

const app: Express = express()
const port = 4000
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your UI domain
    credentials: true, // Enable sending cookies,
    preflightContinue: true
  })
)

// app.use(compression())
morgan('tiny')
app.use(helmet())
app.use(cookieParser())
app.use(bodyParser.json())
// app.get('/auth/sessions', sessionsHandler)
app.use('/', router())

// app.get('/auth/sessions', (req, res) => {
//   console.log(req.cookies) // Log the value of req.cookies
//   const cookies = req.cookies
//   res.cookie('sessionId', '3c196d67-b096-49f1-874c-19b32c25bc45')
//   res.send(`Cookie set successfully${JSON.stringify(cookies)}`)
// })
// setupSwagger(app)
// const server = http.createServer(app)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
