export interface Project {
  id: string
  title: string
  short_description: string
  description: string
  category: string
  tags: string[]
  job_info: string
  year: number
  value: number
  status: 'active' | 'draft'
  featured: boolean
  main_image: string
  sort_order: number
  created_at: string
  updated_at: string
  gallery?: ProjectGallery[]
}

export interface ProjectGallery {
  id: string
  project_id: string
  image: string
  sort_order: number
}

export interface Client {
  id: string
  name: string
  logo_image: string
  sort_order: number
  link_url?: string
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
}

export interface AdminInvite {
  id: string
  email: string
  invite_token_hash: string
  expires_at: string
  accepted_at?: string
}

export type Locale = 'en' | 'th'

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}
