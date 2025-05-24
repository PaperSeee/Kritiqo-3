export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          platform: 'google' | 'facebook'
          original_url: string
          slug: string
          custom_url: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          platform: 'google' | 'facebook'
          original_url: string
          slug: string
          custom_url: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          platform?: 'google' | 'facebook'
          original_url?: string
          slug?: string
          custom_url?: string
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}
