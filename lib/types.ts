export interface User {
  id: string
  email: string
  credits: number
  role: 'user' | 'admin'
  status: 'active' | 'blocked'
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface Render {
  id: string
  project_id: string
  before_image_url: string
  after_image_url: string | null
  style: string
  created_at: string
}

export interface Style {
  id: string
  name: string
  created_at: string
}

// Database relationship types
export interface ProjectWithRenders extends Project {
  renders: Render[]
}

export interface RenderWithProject extends Render {
  project: Project
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Auth types
export interface AuthUser {
  id: string
  email: string
}

// Storage types
export interface UploadResult {
  url: string
  path: string
}
