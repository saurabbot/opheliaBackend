import { Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../lib/prisma'
import bcrypt from 'bcrypt'
// import cookieParser from 'cookie-parser'
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
      return res.status(400).json({ message: 'please enter all details' })
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
      },
      select: {
        username: true,
        id: true,
        email: true,
        emailVerified: true,
        image: true,
        accounts: true,
        sessions: true
      }
    })
    return res
      .status(201)
      .json({
        result: true,
        message: 'User created successfully',
        user: newUser
      })
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
      return res.status(400).json({ message: 'please enter all details' })
    }
    const user = await db.user.findFirst({ where: { email } })
    if (!user) {
      return res.status(404).json({
        result: false,
        message: 'User not found, check email once again'
      })
    }
    const isPasswordSame = await bcrypt.compare(password, user.password)
    if (isPasswordSame) {
      const sessionToken = uuidv4()
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      const session = await db.session.create({
        data: {
          sessionToken,
          expires,
          user: { connect: { id: user.id } }
        }
      })
      res.cookie('sessionId', sessionToken, {
        httpOnly: true,
        secure: true, // Enable if using HTTPS
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // Set the expiration time for the cookie (30 days)
      })
      return res.status(200).json({ result: true, message: 'Logged in', user })
    } else {
      return res
        .status(403)
        .json({ result: false, message: 'Authentication failed' })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const sessionsHandler = async (req: Request, res: Response) => {
  try {
    console.log(req.cookies, 's')
    const { sessionId } = req.cookies
    if (!sessionId) {
      return res
        .status(404)
        .json({ result: false, message: 'User not logged in' })
    }
    const session = await db.session.findUnique({
      where: { sessionToken: sessionId }
    })
    if (!session) {
      return res
        .status(404)
        .json({ result: false, message: 'User not logged in' })
    }
    const user = await db.user.findUnique({ where: { id: session.userId } })
    if (!user) {
      return res
        .status(404)
        .json({ result: false, message: 'User not logged in' })
    }
    return res
      .status(200)
      .json({ result: true, message: 'user logged in', user })
  } catch (err) {
    res.status(500).json({ error: `Server Error${err}` })
  }
}

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.cookies
    if (!sessionId) {
      return res
        .status(404)
        .json({ result: false, message: 'user session not found' })
    }
    await db.session.delete({
      where: { sessionToken: sessionId }
    })
    res.clearCookie('sessionId')
    return res.status(200).json({ result: true, message: 'user logged out' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
