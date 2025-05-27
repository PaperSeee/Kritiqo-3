import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

interface GoogleAccount {
  name: string
  accountName: string
  type: string
  role: string
}

interface GoogleLocation {
  name: string
  title: string
  storefrontAddress?: {
    addressLines?: string[]
    locality?: string
    administrativeArea?: string
    postalCode?: string
    regionCode?: string
  }
  phoneNumbers?: {
    primaryPhone?: string
  }
  websiteUri?: string
  metadata?: {
    placeId?: string
  }
  profile?: {
    description?: string
  }
  relationshipData?: {
    parentChain?: {
      chainName?: string
    }
  }
  serviceArea?: any
  labels?: string[]
  adWordsLocationExtensions?: any
  liveStats?: any
  moreHours?: any
  openInfo?: any
  regularHours?: any
  specialHours?: any
  serviceItems?: any
  attributes?: any
}

export async function POST(request: Request) {
  try {
    console.log('🔍 [Google Business Profile v1] Début de la récupération des fiches')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      console.error('❌ [Google Business Profile] Session utilisateur manquante')
      return NextResponse.json({ error: 'Non autorisé - Session manquante' }, { status: 401 })
    }

    // Récupérer le token depuis la requête ou la session
    let accessToken: string
    
    try {
      const { accessToken: tokenFromBody } = await request.json()
      accessToken = tokenFromBody || session.accessToken
    } catch {
      accessToken = session.accessToken as string
    }

    if (!accessToken) {
      console.error('❌ [Google Business Profile] Token d\'accès manquant')
      return NextResponse.json({ 
        error: 'Token d\'accès Google Business manquant. Veuillez vous reconnecter.' 
      }, { status: 401 })
    }

    console.log('🚀 [Google Business Profile v1] Appel API accounts...')

    // Étape 1: Récupérer les comptes Google Business Profile v1
    const accountsResponse = await fetch('https://businessprofile.googleapis.com/v1/accounts', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text()
      console.error('❌ [Google Business Profile] Erreur API accounts:', {
        status: accountsResponse.status,
        statusText: accountsResponse.statusText,
        error: errorText
      })

      if (accountsResponse.status === 401) {
        return NextResponse.json({ 
          error: 'Token Google Business expiré ou invalide. Veuillez vous reconnecter.' 
        }, { status: 401 })
      }
      if (accountsResponse.status === 403) {
        return NextResponse.json({ 
          error: 'Accès refusé. Vérifiez que votre compte Google a accès à Google Business Profile et que les scopes sont corrects.' 
        }, { status: 403 })
      }
      
      throw new Error(`Erreur API Google Business Profile accounts: ${accountsResponse.status} - ${accountsResponse.statusText}`)
    }

    const accountsData = await accountsResponse.json()
    console.log('📋 [Google Business Profile] Données brutes accounts:', JSON.stringify(accountsData, null, 2))

    const accounts: GoogleAccount[] = accountsData.accounts || []

    if (accounts.length === 0) {
      console.warn('⚠️ [Google Business Profile] Aucun compte trouvé')
      return NextResponse.json({ 
        error: 'Aucun compte Google Business Profile trouvé. Veuillez vérifier que vous avez configuré Google Business Profile.',
        locations: []
      }, { status: 404 })
    }

    console.log(`✅ [Google Business Profile] ${accounts.length} compte(s) trouvé(s)`)

    // Log des noms de comptes trouvés
    accounts.forEach((account, index) => {
      console.log(`📊 [Google Business Profile] Compte ${index + 1}: ${account.name} (${account.accountName || 'Nom non disponible'})`)
    })

    // Étape 2: Récupérer les établissements pour chaque compte
    const allLocations = []
    
    for (const account of accounts) {
      try {
        // Étape 3: Utiliser le nom complet du compte (ex: "accounts/1234567890")
        const accountName = account.name
        
        if (!accountName || !accountName.startsWith('accounts/')) {
          console.error('❌ [Google Business Profile] Format de nom de compte invalide:', accountName)
          continue
        }

        console.log(`🔍 [Google Business Profile] Traitement du compte: ${accountName} (${account.accountName || 'Sans nom'})`)

        // Étape 4: Appeler l'API locations v1 avec le nom complet du compte
        const locationsResponse = await fetch(
          `https://businessprofile.googleapis.com/v1/${accountName}/locations`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!locationsResponse.ok) {
          const errorText = await locationsResponse.text()
          console.error(`❌ [Google Business Profile] Erreur API locations pour compte ${accountName}:`, {
            status: locationsResponse.status,
            statusText: locationsResponse.statusText,
            error: errorText
          })
          continue // Continuer avec les autres comptes
        }

        const locationsData = await locationsResponse.json()
        console.log(`📋 [Google Business Profile] Données brutes locations pour ${accountName}:`, JSON.stringify(locationsData, null, 2))

        const locations: GoogleLocation[] = locationsData.locations || []
        
        if (locations.length === 0) {
          console.log(`ℹ️ [Google Business Profile] Aucun établissement trouvé pour le compte ${accountName}`)
          continue
        }

        // Étape 5: Transformer les données au format attendu
        const transformedLocations = locations.map(location => {
          const addressParts = []
          if (location.storefrontAddress?.addressLines) {
            addressParts.push(...location.storefrontAddress.addressLines)
          }
          if (location.storefrontAddress?.locality) {
            addressParts.push(location.storefrontAddress.locality)
          }
          if (location.storefrontAddress?.administrativeArea) {
            addressParts.push(location.storefrontAddress.administrativeArea)
          }
          if (location.storefrontAddress?.postalCode) {
            addressParts.push(location.storefrontAddress.postalCode)
          }

          // Extraire l'ID de la location (ex: "accounts/123/locations/456" -> "456")
          const locationId = location.name.split('/').pop() || location.name

          // Déterminer le statut de vérification (Business Profile v1 peut avoir différents champs)
          let verificationState = 'UNVERIFIED'
          // Note: Le statut de vérification peut être dans différents champs selon la version de l'API
          // Vous devrez peut-être ajuster selon les données réelles retournées

          const transformedLocation = {
            id: locationId,
            name: location.title || 'Nom non disponible',
            address: addressParts.join(', ') || undefined,
            phone: location.phoneNumbers?.primaryPhone || undefined,
            website: location.websiteUri || undefined,
            state: verificationState,
            accountId: accountName,
            accountName: account.accountName || 'Compte sans nom',
            placeId: location.metadata?.placeId,
            description: location.profile?.description
          }

          console.log(`📍 [Google Business Profile] Établissement traité: ${transformedLocation.name} (ID: ${locationId}, Status: ${verificationState})`)

          return transformedLocation
        })

        allLocations.push(...transformedLocations)
        console.log(`✅ [Google Business Profile] ${transformedLocations.length} établissement(s) ajouté(s) pour le compte ${accountName} (${account.accountName || 'Sans nom'})`)

      } catch (locationError) {
        console.error(`❌ [Google Business Profile] Erreur lors du traitement du compte ${account.name}:`, locationError)
        // Continuer avec les autres comptes même si celui-ci échoue
        continue
      }
    }

    console.log(`🎉 [Google Business Profile] Récupération terminée: ${allLocations.length} établissement(s) au total`)

    // Log détaillé des résultats
    if (allLocations.length > 0) {
      console.log('📊 [Google Business Profile] Résumé des établissements:')
      allLocations.forEach((location, index) => {
        console.log(`  ${index + 1}. ${location.name} - ${location.state} - Compte: ${location.accountName}`)
      })
    }

    return NextResponse.json({ 
      locations: allLocations,
      totalAccounts: accounts.length,
      message: allLocations.length > 0 
        ? `${allLocations.length} établissement(s) trouvé(s) dans ${accounts.length} compte(s)`
        : 'Aucun établissement trouvé dans vos comptes Google Business Profile'
    })

  } catch (error) {
    console.error('❌ [Google Business Profile] Erreur générale:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    
    return NextResponse.json({
      error: `Erreur lors de la récupération des fiches Google Business Profile: ${errorMessage}`,
      locations: []
    }, { status: 500 })
  }
}
