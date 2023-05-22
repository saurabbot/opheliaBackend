import { Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../lib/prisma'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3)
})

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = signUpSchema.parse(req.body)
    if (!email || !username || !password) {
      res.status(400).json({ message: 'please enter all details' })
    }
    const existingUser = await db.user.findFirst({ where: { email } })
    if (existingUser) {
      res.status(409).json({ message: 'Email already exists' })
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    })
    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser })
      .end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
const singInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = singInSchema.parse(req.body)
    if (!email || !password) {
      res.status(400).json({ message: 'please enter all details' })
    }
    const user = await db.user.findFirst({ where: { email } })
    const isPasswordSame = await bcrypt.compare(password, user.password)
    if (isPasswordSame) {
      // req.session.user = user

      const sessionId = uuidv4()

      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: true, // Enable if using HTTPS
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // Set the expiration time for the cookie (30 days)
      })
      res.status(200).json({ result: true, message: 'Logged in', user })
      return
    } else {
      res
        .status(403)
        .json({ result: false, message: 'authentication failed', user })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// export const isUserLoggedIn = (req: Request, res: Response) => {

// }