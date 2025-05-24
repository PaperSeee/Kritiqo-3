export function slugify(text: string, suffix?: string): string {
  const baseSlug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  
  if (suffix) {
    return `${baseSlug}-${suffix}`
  }
  
  return baseSlug
}

export function generateBusinessSlug(name: string, city: string): string {
  const timestamp = Date.now().toString().slice(-4)
  return slugify(`${name} ${city}`, timestamp)
}
