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
