import express from 'express'
import { signUp, signIn, sessionsHandler } from '../controller/auth'
export default (router: express.Router) => {
  router.post('/auth/signup', signUp)
  router.post('/auth/signin', signIn)
  router.get('/auth/sessions', sessionsHandler)
}
