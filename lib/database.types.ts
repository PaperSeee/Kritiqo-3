export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
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
          user_id: string
          created_at: string
        }
        Insert: {
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
          user_id: string
        }
        Update: {
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
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          slug: string
          email: string
          phone: string
          address: string
          city: string
          country: string
          google_url?: string
          facebook_url?: string
          tripadvisor_url?: string
          ubereats_url?: string
          deliveroo_url?: string
          takeaway_url?: string
          review_page_url: string
          user_id: string
          created_at: string
        }
        Insert: {
          name: string
          slug: string
          email: string
          phone: string
          address: string
          city: string
          country: string
          google_url?: string
          facebook_url?: string
          tripadvisor_url?: string
          ubereats_url?: string
          deliveroo_url?: string
          takeaway_url?: string
          review_page_url: string
          user_id: string
        }
        Update: {
          name?: string
          slug?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          country?: string
          google_url?: string
          facebook_url?: string
          tripadvisor_url?: string
          ubereats_url?: string
          deliveroo_url?: string
          takeaway_url?: string
          review_page_url?: string
        }
      }
    }
  }
}
