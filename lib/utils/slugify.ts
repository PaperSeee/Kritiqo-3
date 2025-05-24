export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function generateBusinessSlug(name: string, city: string): string {
  const baseSlug = slugify(`${name} ${city}`)
  const timestamp = Date.now().toString().slice(-4)
  return `${baseSlug}-${timestamp}`
}
