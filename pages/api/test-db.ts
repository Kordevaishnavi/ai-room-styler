import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Test database connection by fetching styles
    const { data: styles, error } = await supabase
      .from('styles')
      .select('*')

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: error.message 
      })
    }

    return res.status(200).json({
      message: 'Supabase connection successful!',
      stylesCount: styles?.length || 0,
      styles: styles || []
    })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
