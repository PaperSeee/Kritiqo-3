export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          city: string
          country: string
          email?: string
          phone?: string
          address?: string
          google_link: string
          ubereats_link?: string
          deliveroo_link?: string
          takeaway_link?: string
          place_id?: string
          review_page_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          city: string
          country: string
          email?: string
          phone?: string
          address?: string
          google_link: string
          ubereats_link?: string
          deliveroo_link?: string
          takeaway_link?: string
          place_id?: string
          review_page_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          city?: string
          country?: string
          email?: string
          phone?: string
          address?: string
          google_link?: string
          ubereats_link?: string
          deliveroo_link?: string
          takeaway_link?: string
          place_id?: string
          review_page_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          customer_name: string
          customer_email?: string
          rating: number
          comment: string
          platform: string
          responded: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_name: string
          customer_email?: string
          rating: number
          comment: string
          platform: string
          responded?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_name?: string
          customer_email?: string
          rating?: number
          comment?: string
          platform?: string
          responded?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      emails: {
        Row: {
          id: string
          user_id: string
          subject: string
          sender: string
          body: string | null
          preview: string | null
          date: string
          source: string
          account_email: string | null
          account_provider: string | null
          gpt_categorie: string | null
          gpt_priorite: string | null
          gpt_action: string | null
          gpt_suggestion: string | null
          analyzed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          subject: string
          sender: string
          body?: string | null
          preview?: string | null
          date: string
          source: string
          account_email?: string | null
          account_provider?: string | null
          gpt_categorie?: string | null
          gpt_priorite?: string | null
          gpt_action?: string | null
          gpt_suggestion?: string | null
          analyzed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          sender?: string
          body?: string | null
          preview?: string | null
          date?: string
          source?: string
          account_email?: string | null
          account_provider?: string | null
          gpt_categorie?: string | null
          gpt_priorite?: string | null
          gpt_action?: string | null
          gpt_suggestion?: string | null
          analyzed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
