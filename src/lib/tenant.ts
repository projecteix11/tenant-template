export const API_URL = import.meta.env.API_URL ?? 'https://api.gobbly.app'

export interface TenantBranding {
  primaryColor?: string
  logo?: string
  coverImage?: string
  tagline?: string
  address?: string
  phone?: string
  email?: string
  socialLinks?: Record<string, string>
}

export interface Tenant {
  id: string
  name: string
  slug: string
  features: Record<string, boolean>
  branding: TenantBranding
}

export interface Category {
  id: string
  name: string
  sort_order: number
  requires_kitchen: boolean
}

export interface Allergen {
  id: string
  name: string
  icon: string | null
}

export interface Dish {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  category_id: string | null
  is_available: boolean
  is_featured: boolean
  allergens: Allergen[]
}

export function getSlugFromHostname(hostname: string): string | null {
  const parts = hostname.split('.')
  if (parts.length >= 2 && (parts[parts.length - 2] === 'gobbly' || parts[parts.length - 2] === 'lvh')) {
    const slug = parts[0]
    const reserved = new Set(['management', 'api', 'admin', 'www', 'app', 'landing', 'status'])
    return reserved.has(slug) ? null : slug
  }
  return null
}

export async function fetchTenant(slug: string): Promise<Tenant | null> {
  try {
    const res = await fetch(`${API_URL}/tenants/by-slug/${slug}`)
    if (!res.ok) return null
    const json = await res.json() as { data: Tenant | null }
    return json.data
  } catch {
    return null
  }
}

export async function fetchFromApi<T>(path: string, slug: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { 'X-Tenant-Slug': slug },
    })
    if (!res.ok) return null
    const json = await res.json() as { data: T | null }
    return json.data
  } catch {
    return null
  }
}
