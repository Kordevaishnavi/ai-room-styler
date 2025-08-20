import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'
import { ensureUser, getUserProfile } from '../../lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return handleGetUser(req, res)
  } else if (req.method === 'POST') {
    return handleCreateUser(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    const user = await getUserProfile(userId)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({ data: user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function handleCreateUser(req: NextApiRequest, res: NextApiResponse) {
  const { id, email } = req.body

  if (!id || !email) {
    return res.status(400).json({ error: 'User ID and email are required' })
  }

  try {
    const user = await ensureUser({ id, email })
    
    if (!user) {
      return res.status(500).json({ error: 'Failed to create user' })
    }

    return res.status(201).json({ 
      data: user,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
