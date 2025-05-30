import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateUserId } from '@/lib/utils/uuid-validator'
import Imap from 'node-imap'
import { simpleParser } from 'mailparser'

interface EmailData {
  id: string
  subject: string
  from: string
  date: Date
  snippet: string
  fullText?: string
}

// Real IMAP extraction function
async function extractEmailsViaIMAP(email: string, appPassword: string): Promise<EmailData[]> {
  console.log(`📧 Starting IMAP extraction for ${email}`)
  
  return new Promise((resolve, reject) => {
    const emails: EmailData[] = []
    let isResolved = false
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (!isResolved) {
        console.error('⏰ IMAP operation timeout')
        isResolved = true
        reject(new Error('IMAP operation timeout'))
      }
    }, 30000) // 30 seconds timeout
    
    // IMAP configuration for Gmail
    const imap = new Imap({
      user: email,
      password: appPassword,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false
      },
      connTimeout: 10000, // 10 seconds connection timeout
      authTimeout: 5000   // 5 seconds auth timeout
    })

    function cleanupAndResolve(result: EmailData[]) {
      if (!isResolved) {
        isResolved = true
        clearTimeout(timeout)
        console.log(`🏁 Cleanup: resolving with ${result.length} emails`)
        resolve(result)
      }
    }

    function cleanupAndReject(error: Error) {
      if (!isResolved) {
        isResolved = true
        clearTimeout(timeout)
        console.error('🏁 Cleanup: rejecting with error:', error.message)
        reject(error)
      }
    }

    imap.once('ready', function() {
      console.log('✅ IMAP connection ready')
      
      // Étape 1: Ouvrir la boîte INBOX
      console.log('📥 Opening INBOX...')
      imap.openBox('INBOX', true, function(err, box) {
        if (err) {
          console.error('❌ Error opening inbox:', err.message)
          cleanupAndReject(err)
          return
        }
        
        console.log(`✅ INBOX opened successfully - ${box.messages.total} total messages`)
        
        if (box.messages.total === 0) {
          console.log('📭 No messages in inbox')
          imap.end()
          return
        }
        
        // Étape 2: Rechercher TOUS les emails avec search(['ALL'])
        console.log('🔍 Searching for ALL emails...')
        imap.search(['ALL'], function(searchErr, results) {
          if (searchErr) {
            console.error('❌ Search error:', searchErr.message)
            cleanupAndReject(searchErr)
            return
          }
          
          if (!results || results.length === 0) {
            console.log('📭 No messages found in search')
            imap.end()
            return
          }
          
          console.log(`🔍 Found ${results.length} messages via search`)
          
          // Étape 3: Prendre les 10 derniers messages (UIDs)
          const lastMessageUIDs = results.slice(-10)
          console.log(`📨 Last 10 message UIDs:`, lastMessageUIDs)
          
          // Convertir les UIDs en numéros de séquence pour seq.fetch
          const totalMessages = box.messages.total
          const startSeq = Math.max(1, totalMessages - lastMessageUIDs.length + 1)
          const endSeq = totalMessages
          
          console.log(`📨 Fetching sequence ${startSeq}:${endSeq} (last ${lastMessageUIDs.length} messages)`)
          
          // Étape 4: Utiliser imap.seq.fetch() pour extraire les emails
          const fetch = imap.seq.fetch(`${startSeq}:${endSeq}`, {
            bodies: '', // Récupérer le corps complet
            struct: true
          })
          
          let messageCount = 0
          const expectedMessages = endSeq - startSeq + 1
          
          fetch.on('message', function(msg, seqno) {
            console.log(`📨 Processing message sequence ${seqno}`)
            
            let buffer = ''
            let attributes: any = null
            
            msg.on('body', function(stream, info) {
              console.log(`📄 Receiving body for sequence ${seqno}`)
              stream.on('data', function(chunk) {
                buffer += chunk.toString('utf8')
              })
              
              stream.once('error', function(streamErr) {
                console.error(`❌ Stream error for sequence ${seqno}:`, streamErr.message)
              })
            })
            
            msg.once('attributes', function(attrs) {
              console.log(`📋 Attributes received for sequence ${seqno}`)
              attributes = attrs
            })
            
            msg.once('end', function() {
              console.log(`✅ Message sequence ${seqno} received, parsing...`)
              
              if (!buffer) {
                console.warn(`⚠️ Empty buffer for sequence ${seqno}`)
                messageCount++
                checkCompletion()
                return
              }
              
              // Étape 5: Parser le contenu avec mailparser
              simpleParser(buffer, (parseErr, parsed) => {
                if (parseErr) {
                  console.error(`❌ Error parsing sequence ${seqno}:`, parseErr.message)
                  messageCount++
                  checkCompletion()
                  return
                }
                
                try {
                  // Extraire les champs requis : subject, from, date, snippet
                  const fromHeader = parsed.from?.value[0]
                  const senderName = fromHeader?.name || fromHeader?.address?.split('@')[0] || 'Unknown'
                  const senderEmail = fromHeader?.address || 'unknown@unknown.com'
                  
                  // Créer l'objet email pour l'interface Kritiqo
                  const emailData: EmailData = {
                    id: `imap_${email}_${attributes?.uid || seqno}`,
                    subject: parsed.subject || 'No Subject',
                    from: `${senderName} <${senderEmail}>`,
                    date: parsed.date || new Date(),
                    snippet: parsed.text?.substring(0, 200) || 'Aucun aperçu disponible',
                    fullText: parsed.text || parsed.html || ''
                  }
                  
                  emails.push(emailData)
                  messageCount++
                  
                  console.log(`📧 Parsed sequence ${seqno}: "${emailData.subject}" from ${senderName}`)
                  checkCompletion()
                  
                } catch (parseError) {
                  console.error(`❌ Error processing sequence ${seqno}:`, parseError)
                  messageCount++
                  checkCompletion()
                }
              })
            })
            
            msg.once('error', function(msgErr) {
              console.error(`❌ Message error for sequence ${seqno}:`, msgErr.message)
              messageCount++
              checkCompletion()
            })
          })
          
          function checkCompletion() {
            console.log(`📊 Progress: ${messageCount}/${expectedMessages} messages processed`)
            if (messageCount >= expectedMessages) {
              console.log(`✅ All ${messageCount} messages processed, ending connection`)
              // Étape 6: Fermer proprement la connexion
              imap.end()
            }
          }
          
          fetch.once('error', function(fetchErr) {
            console.error('❌ Fetch error:', fetchErr.message)
            cleanupAndReject(fetchErr)
          })
          
          fetch.once('end', function() {
            console.log('📬 Fetch completed')
            // La completion est gérée par checkCompletion()
          })
        })
      })
    })

    imap.once('error', function(err) {
      console.error('❌ IMAP connection error:', err.message)
      cleanupAndReject(err)
    })

    imap.once('end', function() {
      console.log('📪 IMAP connection ended')
      cleanupAndResolve(emails)
    })

    console.log('🔌 Connecting to IMAP...')
    try {
      imap.connect()
    } catch (connectErr) {
      console.error('❌ IMAP connect error:', connectErr)
      cleanupAndReject(connectErr as Error)
    }
  })
}

function classifyEmail(subject: string, from: string, content: string) {
  const subjectLower = subject.toLowerCase()
  const fromLower = from.toLowerCase()
  const contentLower = content.toLowerCase()
  
  // Detect spam/advertising
  if (fromLower.includes('noreply') || 
      subjectLower.includes('promotion') || 
      subjectLower.includes('réduction') ||
      contentLower.includes('cliquez ici')) {
    return { category: 'Spam/Pub', priority: 'Faible', isSpam: true }
  }
  
  // Detect customer reviews
  if (subjectLower.includes('avis') || 
      contentLower.includes('restaurant') ||
      contentLower.includes('service') ||
      contentLower.includes('repas')) {
    return { category: 'Avis client', priority: 'Urgent', isSpam: false }
  }
  
  // Detect invoices
  if (subjectLower.includes('facture') || 
      subjectLower.includes('commande') ||
      contentLower.includes('montant')) {
    return { category: 'Facture', priority: 'Moyen', isSpam: false }
  }
  
  return { category: 'Autre', priority: 'Moyen', isSpam: false }
}

// Extract sender name from email header like "John Doe <john@example.com>"
function extractSenderName(fromHeader: string): string {
  const match = fromHeader.match(/^(.+?)\s*<.*>$/)
  return match ? match[1].replace(/['"]/g, '').trim() : fromHeader.split('@')[0]
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const userId = validateUserId(session.userId)
    const { email, appPassword } = await request.json()

    if (!email || !appPassword) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    console.log(`🚀 Starting email extraction for ${email}`)

    // Extract emails via IMAP
    const emailsData = await extractEmailsViaIMAP(email, appPassword)
    
    if (emailsData.length === 0) {
      return NextResponse.json({
        success: true,
        extracted: 0,
        message: 'Aucun email trouvé'
      })
    }

    console.log(`📧 Successfully extracted ${emailsData.length} emails`)

    // Prepare emails for Supabase
    const emailsToSave = emailsData.map(emailData => {
      const classification = classifyEmail(emailData.subject, emailData.from, emailData.fullText || emailData.snippet)
      const senderName = extractSenderName(emailData.from)
      
      return {
        id: emailData.id,
        user_id: userId,
        account_email: email,
        subject: emailData.subject,
        from_email: emailData.from,
        sender_name: senderName,
        date: emailData.date.toISOString(),
        snippet: emailData.snippet,
        full_text: emailData.fullText || emailData.snippet,
        category: classification.category,
        priority: classification.priority,
        is_spam: classification.isSpam,
        analyzed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

    // Save to database with upsert to avoid duplicates
    const { data, error } = await supabaseAdmin
      .from('emails')
      .upsert(emailsToSave, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select('id')

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    const extracted = data?.length || 0
    console.log(`✅ ${extracted} emails saved to database for ${email}`)

    return NextResponse.json({
      success: true,
      extracted,
      total: emailsData.length,
      skipped: emailsData.length - extracted,
      message: `${extracted} emails extraits avec succès`
    })

  } catch (error) {
    console.error('❌ IMAP extraction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur extraction emails' },
      { status: 500 }
    )
  }
}
