import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { validateUserId } from '@/lib/utils/uuid-validator'

interface EmailData {
  id: string
  subject: string
  from: string
  date: Date
  snippet: string
  fullText?: string
  folder: string // Add folder information
}

interface FolderInfo {
  name: string
  messageCount: number
}

// Comprehensive IMAP extraction function that explores all folders
async function extractEmailsFromAllFolders(email: string, appPassword: string): Promise<EmailData[]> {
  console.log(`📧 Starting comprehensive IMAP extraction for ${email}`)
  
  // Import imap-simple properly
  const imaps = await import('imap-simple');
  
  const isDev = process.env.NODE_ENV !== "production";
  
  const config = {
    imap: {
      user: email,
      password: appPassword,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: isDev ? { rejectUnauthorized: false } : undefined,
      authTimeout: 10000,
      connTimeout: 15000
    }
  }

  try {
    console.log(`🔒 IMAP Config - TLS: ${config.imap.tls}, Dev mode: ${isDev}`)
    const connection = await imaps.connect(config)
    console.log('✅ IMAP connection established')

    // Step 1: Get all available folders
    const boxes = await connection.getBoxes()
    const flatBoxes: string[] = []

    // Recursive function to flatten folders (including subfolders)
    function flattenBoxes(boxes: any, prefix = '') {
      for (const key in boxes) {
        const folderName = prefix + key
        flatBoxes.push(folderName)
        
        if (boxes[key].children) {
          flattenBoxes(boxes[key].children, `${folderName}${boxes[key].delimiter}`)
        }
      }
    }

    flattenBoxes(boxes)
    console.log(`📁 Found ${flatBoxes.length} folders:`, flatBoxes)

    const allEmails: EmailData[] = []
    const folderStats: FolderInfo[] = []

    // Step 2: Explore each folder
    for (const folderName of flatBoxes) {
      try {
        console.log(`📥 Opening folder: "${folderName}"`)
        
        await connection.openBox(folderName)
        
        // Step 3: Search for ALL emails in current folder
        const messages = await connection.search(['ALL'], {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
          struct: true
        })

        console.log(`📥 Folder "${folderName}": ${messages.length} emails found`)
        folderStats.push({ name: folderName, messageCount: messages.length })

        if (messages.length === 0) {
          continue
        }

        // Step 4: Process messages (limit to last 5 per folder for performance)
        const messagesToProcess = messages.slice(-5)
        
        for (const message of messagesToProcess) {
          try {
            const parts = imaps.getParts(message.attributes.struct)
            
            // Extract headers
            const headers = message.parts.find((part: any) => part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)')
            const textPart = message.parts.find((part: any) => part.which === 'TEXT')
            
            if (!headers) continue

            // Parse headers
            const headerLines = headers.body
            const subject = extractHeader(headerLines, 'Subject') || 'No Subject'
            const from = extractHeader(headerLines, 'From') || 'Unknown Sender'
            const dateStr = extractHeader(headerLines, 'Date')
            
            let emailDate = new Date()
            if (dateStr) {
              try {
                emailDate = new Date(dateStr)
              } catch {
                emailDate = new Date()
              }
            }

            // Extract body text
            let bodyText = ''
            if (textPart && textPart.body) {
              bodyText = textPart.body.substring(0, 500) // Limit to 500 chars
            }

            const emailData: EmailData = {
              id: `imap_${email}_${folderName}_${message.attributes.uid}`,
              subject: subject,
              from: from,
              date: emailDate,
              snippet: bodyText.substring(0, 200) || 'Aucun aperçu disponible',
              fullText: bodyText,
              folder: folderName
            }

            allEmails.push(emailData)
            
          } catch (msgError) {
            console.warn(`⚠️ Error processing message in ${folderName}:`, msgError)
            continue
          }
        }

      } catch (folderError) {
        console.warn(`⚠️ Error accessing folder "${folderName}":`, folderError)
        folderStats.push({ name: folderName, messageCount: 0 })
        continue
      }
    }

    await connection.end()
    
    // Log folder statistics
    console.log('\n📊 FOLDER STATISTICS:')
    folderStats.forEach(folder => {
      console.log(`📥 Folder "${folder.name}": ${folder.messageCount} emails`)
    })
    
    console.log(`\n✅ Total emails extracted: ${allEmails.length}`)
    return allEmails

  } catch (error) {
    console.error('❌ IMAP extraction error:', error)
    if (error instanceof Error && error.message?.includes('self signed certificate')) {
      console.error('💡 TLS Certificate issue - try adjusting tlsOptions')
    }
    throw error
  }
}

// Helper function to extract header values
function extractHeader(headerText: string, headerName: string): string | null {
  const regex = new RegExp(`^${headerName}:\\s*(.+)$`, 'im')
  const match = headerText.match(regex)
  return match ? match[1].trim() : null
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

    console.log(`🚀 Starting comprehensive email extraction for ${email}`)

    // Extract emails from all folders via IMAP
    const emailsData = await extractEmailsFromAllFolders(email, appPassword)
    
    if (emailsData.length === 0) {
      return NextResponse.json({
        success: true,
        extracted: 0,
        message: 'Aucun email trouvé dans tous les dossiers'
      })
    }

    console.log(`📧 Successfully extracted ${emailsData.length} emails from all folders`)

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
        folder: emailData.folder, // Include folder information
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
      message: `${extracted} emails extraits depuis tous les dossiers IMAP`
    })

  } catch (error) {
    console.error('❌ Comprehensive IMAP extraction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur extraction emails' },
      { status: 500 }
    )
  }
}
