import { Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../lib/prisma'
import bcrypt from 'bcrypt'
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

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
