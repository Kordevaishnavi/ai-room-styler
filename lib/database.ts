import { supabase } from './supabase'
import type { User, Project, Render, Style } from './types'

// User operations
export async function ensureUser(authUser: { id: string; email: string }): Promise<User | null> {
  try {
    // First try to get existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (existingUser && !fetchError) {
      return existingUser
    }

    // If user doesn't exist, create them
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email,
        credits: 50
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      return null
    }

    return newUser
  } catch (error) {
    console.error('Error in ensureUser:', error)
    return null
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function updateUserCredits(userId: string, credits: number): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({ credits })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user credits:', error)
    return false
  }

  return true
}

// Project operations
export async function createProject(userId: string, name: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return null
  }

  return data
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user projects:', error)
    return []
  }

  return data || []
}

export async function deleteProject(projectId: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    console.error('Error deleting project:', error)
    return false
  }

  return true
}

// Render operations
export async function createRender(
  projectId: string,
  beforeImageUrl: string,
  style: string
): Promise<Render | null> {
  const { data, error } = await supabase
    .from('renders')
    .insert({
      project_id: projectId,
      before_image_url: beforeImageUrl,
      style
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating render:', error)
    return null
  }

  return data
}

export async function createRenderWithUpload(
  projectId: string,
  userId: string,
  beforeImageFile: File,
  style: string
): Promise<Render | null> {
  // First upload the image
  const uploadResult = await uploadImage(beforeImageFile, userId)
  if (!uploadResult) {
    console.error('Failed to upload image')
    return null
  }

  // Then create the render record
  return createRender(projectId, uploadResult.url, style)
}

export async function updateRenderResult(
  renderId: string,
  afterImageUrl: string
): Promise<boolean> {
  const { error } = await supabase
    .from('renders')
    .update({ after_image_url: afterImageUrl })
    .eq('id', renderId)

  if (error) {
    console.error('Error updating render result:', error)
    return false
  }

  return true
}

export async function getProjectRenders(projectId: string): Promise<Render[]> {
  const { data, error } = await supabase
    .from('renders')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching project renders:', error)
    return []
  }

  return data || []
}

// Style operations
export async function getAllStyles(): Promise<Style[]> {
  const { data, error } = await supabase
    .from('styles')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching styles:', error)
    return []
  }

  return data || []
}

// Storage operations
export async function uploadImage(
  file: File,
  userId: string,
  bucket: string = 'project-images'
): Promise<{ url: string; path: string } | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  // Store files in user-specific folders as per RLS policy
  const filePath = `${userId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading file:', uploadError)
    return null
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return {
    url: urlData.publicUrl,
    path: filePath
  }
}
