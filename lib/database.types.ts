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
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          place_id: string | null
          google_link: string | null
          ubereats_link: string | null
          deliveroo_link: string | null
          takeaway_link: string | null
          review_page_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          place_id?: string | null
          google_link?: string | null
          ubereats_link?: string | null
          deliveroo_link?: string | null
          takeaway_link?: string | null
          review_page_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          place_id?: string | null
          google_link?: string | null
          ubereats_link?: string | null
          deliveroo_link?: string | null
          takeaway_link?: string | null
          review_page_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          customer_name: string
          customer_email: string | null
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
          customer_email?: string | null
          rating: number
          comment: string
          platform?: string
          responded?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          customer_name?: string
          customer_email?: string | null
          rating?: number
          comment?: string
          platform?: string
          responded?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      connected_emails: {
        Row: {
          id: string
          user_id: string
          email: string
          provider: string
          access_token: string | null
          refresh_token: string | null
          expires_at: number | null
          token_type: string
          scope: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          provider: string
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: number | null
          token_type?: string
          scope?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          provider?: string
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: number | null
          token_type?: string
          scope?: string | null
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
      cvs: {
        Row: {
          id: string
          user_id: string
          filename: string
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          is_primary: boolean
          upload_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          filename: string
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          is_primary?: boolean
          upload_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          original_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          is_primary?: boolean
          upload_date?: string
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
