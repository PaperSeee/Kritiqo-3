import { useState, useEffect } from 'react';

interface Email {
  id: string;
  subject: string;
  sender: string;
  date: string;
  preview: string;
  source: string;
  accountEmail: string;
  autoCategory?: any;
}

interface UseEmailsReturn {
  emails: Email[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEmails(): UseEmailsReturn {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from all sources: existing API + new IMAP + Microsoft
      const [existingResponse, imapResponse, microsoftResponse] = await Promise.allSettled([
        fetch('/api/emails'),
        fetch('/api/emails/imap'),
        fetch('/api/emails/microsoft')
      ]);

      const allEmails: Email[] = [];

      // Process existing emails
      if (existingResponse.status === 'fulfilled' && existingResponse.value.ok) {
        const existingData = await existingResponse.value.json();
        if (existingData.emails) {
          allEmails.push(...existingData.emails);
        }
      }

      // Process IMAP emails
      if (imapResponse.status === 'fulfilled' && imapResponse.value.ok) {
        const imapData = await imapResponse.value.json();
        if (imapData.emails) {
          allEmails.push(...imapData.emails.map((email: any) => ({
            ...email,
            source: 'imap',
            accountEmail: email.accountEmail || email.sender
          })));
        }
      }

      // Process Microsoft emails
      if (microsoftResponse.status === 'fulfilled' && microsoftResponse.value.ok) {
        const microsoftData = await microsoftResponse.value.json();
        if (microsoftData.emails) {
          allEmails.push(...microsoftData.emails.map((email: any) => ({
            ...email,
            source: 'microsoft',
            accountEmail: email.accountEmail || email.sender
          })));
        }
      }

      // Remove duplicates based on subject + sender + date combination
      const uniqueEmails = allEmails.filter((email, index, array) => 
        array.findIndex(e => 
          e.subject === email.subject && 
          e.sender === email.sender &&
          e.date?.split('T')[0] === email.date?.split('T')[0]
        ) === index
      );

      // Sort by date (newest first)
      uniqueEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setEmails(uniqueEmails);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors du chargement des emails';
      setError(errorMsg);
      console.error('❌ useEmails error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return { 
    emails, 
    loading, 
    error, 
    refetch: fetchEmails 
  };
}
