import express from 'express'
import { signUp, signIn, isUserLoggedIn } from '../controller/auth'
export default (router: express.Router) => {
  router.post('/auth/signup', signUp)
  router.post('/auth/signin', signIn)
  router.post('/auth/sessions', isUserLoggedIn)
}
