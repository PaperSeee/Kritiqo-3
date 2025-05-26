'use client';

import { useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { TriageResult } from '@/lib/types/triage';

export function useTriage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const performTriage = useCallback(async (
    subject: string, 
    body: string, 
    emailId?: string
  ): Promise<TriageResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, body }),
      });

      if (!response.ok) {
        throw new Error('Triage API failed');
      }

      const result: TriageResult = await response.json();

      // Optional: Save to Supabase for history
      if (emailId) {
        try {
          await supabase
            .from('email_triage_history')
            .insert({
              email_id: emailId,
              catégorie: result.catégorie,
              priorité: result.priorité,
              action: result.action,
              suggestion: result.suggestion,
              created_at: new Date().toISOString(),
            });
        } catch (dbError) {
          console.warn('Failed to save triage to database:', dbError);
        }
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Triage failed';
      setError(errorMessage);
      console.error('Triage error:', err);
      
      return {
        catégorie: 'Autre',
        priorité: 'Moyen',
        action: 'Examiner manuellement',
        suggestion: null
      };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    performTriage,
    loading,
    error,
  };
}
