import { supabase } from './supabase'
import type { Project, Client } from '@/types'

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(6)

  if (error) { console.error(error); return [] }
  return (data ?? []).map(normalizeProject)
}

export async function getAllActiveProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, gallery:project_gallery(*)')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (error) { console.error(error); return [] }
  return (data ?? []).map(normalizeProject)
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, gallery:project_gallery(*)')
    .eq('id', id)
    .single()

  if (error) { console.error(error); return null }
  return normalizeProject(data)
}

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getProjectCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .eq('status', 'active')

  if (error) return []
  const cats = [...new Set((data ?? []).map((d: { category: string }) => d.category))]
  return cats.filter(Boolean)
}

export async function getProjectYears(): Promise<number[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('year')
    .eq('status', 'active')

  if (error) return []
  const years = [...new Set((data ?? []).map((d: { year: number }) => d.year))]
  return years.filter(Boolean).sort((a, b) => b - a)
}

function normalizeProject(data: Record<string, unknown>): Project {
  return {
    ...data,
    tags: Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === 'string'
        ? (data.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
        : [],
  } as Project
}
