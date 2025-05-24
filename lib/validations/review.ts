import { z } from 'zod'

// Validation pour les URLs Google Maps avec paramètres étendus
const googleMapsUrlSchema = z.string().refine(
  (url) => {
    try {
      const urlObj = new URL(url)
      // Vérifier que c'est bien un domaine Google
      const validDomains = [
        'www.google.com',
        'google.com',
        'maps.google.com',
        'goo.gl' // Pour les liens raccourcis Google Maps
      ]
      
      return validDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      ) && (
        // Vérifier que c'est un lien Maps
        url.includes('/maps/') || 
        url.includes('maps.google.com') ||
        url.includes('goo.gl') // Liens raccourcis
      )
    } catch {
      return false
    }
  },
  {
    message: "L'URL doit être un lien Google Maps valide"
  }
)

export const reviewFormSchema = z.object({
  businessName: z.string().min(1, "Le nom de l'entreprise est requis"),
  googleMapsUrl: googleMapsUrlSchema,
  description: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Le commentaire est requis').max(500)
})

export type ReviewFormData = z.infer<typeof reviewFormSchema>
