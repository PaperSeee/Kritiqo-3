import { z } from 'zod'

export const reviewFormSchema = z.object({
  googleMapsUrl: z
    .string()
    .min(1, 'URL Google Maps requise')
    .url('URL invalide')
    .refine(
      (url) => url.includes('google.com/maps') || url.includes('maps.google.com'),
      'Veuillez utiliser un lien Google Maps valide'
    ),
  businessName: z.string().optional(),
  notes: z.string().optional(),
})

export type ReviewFormData = z.infer<typeof reviewFormSchema>
