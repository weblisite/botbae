export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      botbae_configs: {
        Row: {
          accessories: Json | null
          avatar_prompt: string | null
          avatar_url: string | null
          body_shape: string | null
          body_type: string
          created_at: string | null
          ethnicity: string
          gender: string
          hair_color: string | null
          hair_type: string
          id: string
          is_active: boolean | null
          name: string
          personality: Json
          profession: string | null
          style: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accessories?: Json | null
          avatar_prompt?: string | null
          avatar_url?: string | null
          body_shape?: string | null
          body_type?: string
          created_at?: string | null
          ethnicity?: string
          gender?: string
          hair_color?: string | null
          hair_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          personality?: Json
          profession?: string | null
          style?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accessories?: Json | null
          avatar_prompt?: string | null
          avatar_url?: string | null
          body_shape?: string | null
          body_type?: string
          created_at?: string | null
          ethnicity?: string
          gender?: string
          hair_color?: string | null
          hair_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          personality?: Json
          profession?: string | null
          style?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          botbae_id: string
          content: string
          created_at: string | null
          id: string
          sender: string
          sentiment: string | null
          user_id: string
        }
        Insert: {
          botbae_id: string
          content: string
          created_at?: string | null
          id?: string
          sender: string
          sentiment?: string | null
          user_id: string
        }
        Update: {
          botbae_id?: string
          content?: string
          created_at?: string | null
          id?: string
          sender?: string
          sentiment?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_botbae_id_fkey"
            columns: ["botbae_id"]
            isOneToOne: false
            referencedRelation: "botbae_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          merchant_reference: string | null
          payment_description: string | null
          payment_method: string | null
          payment_type: string | null
          polar_payment_id: string | null
          polar_subscription_id: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          id?: string
          merchant_reference?: string | null
          payment_description?: string | null
          payment_method?: string | null
          payment_type?: string | null
          polar_payment_id?: string | null
          polar_subscription_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          merchant_reference?: string | null
          payment_description?: string | null
          payment_method?: string | null
          payment_type?: string | null
          polar_payment_id?: string | null
          polar_subscription_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_verified: boolean | null
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_premium: boolean | null
          message_limit: number | null
          messages_used: number | null
          subscription_date: string | null
          subscription_expiry: string | null
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          age_verified?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_premium?: boolean | null
          message_limit?: number | null
          messages_used?: number | null
          subscription_date?: string | null
          subscription_expiry?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          age_verified?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_premium?: boolean | null
          message_limit?: number | null
          messages_used?: number | null
          subscription_date?: string | null
          subscription_expiry?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sms_preferences: {
        Row: {
          created_at: string | null
          evening_time: string | null
          id: string
          is_enabled: boolean | null
          morning_time: string | null
          notifications_types: string[] | null
          phone_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          evening_time?: string | null
          id?: string
          is_enabled?: boolean | null
          morning_time?: string | null
          notifications_types?: string[] | null
          phone_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          evening_time?: string | null
          id?: string
          is_enabled?: boolean | null
          morning_time?: string | null
          notifications_types?: string[] | null
          phone_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          duration_days: number
          features: Json
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_days: number
          features?: Json
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_days?: number
          features?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_insights: {
        Row: {
          created_at: string | null
          id: string
          mood_trends: Json | null
          personal_growth: Json | null
          top_topics: Json | null
          updated_at: string | null
          user_id: string
          weekly_report: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood_trends?: Json | null
          personal_growth?: Json | null
          top_topics?: Json | null
          updated_at?: string | null
          user_id: string
          weekly_report?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mood_trends?: Json | null
          personal_growth?: Json | null
          top_topics?: Json | null
          updated_at?: string | null
          user_id?: string
          weekly_report?: Json | null
        }
        Relationships: []
      }
      user_memories: {
        Row: {
          birthday: string | null
          created_at: string | null
          favorite_topics: string[] | null
          goals: Json | null
          id: string
          interests: string[] | null
          preferences: Json | null
          recent_events: Json | null
          relationship_milestones: Json | null
          relationship_stage: string
          relationship_start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birthday?: string | null
          created_at?: string | null
          favorite_topics?: string[] | null
          goals?: Json | null
          id?: string
          interests?: string[] | null
          preferences?: Json | null
          recent_events?: Json | null
          relationship_milestones?: Json | null
          relationship_stage?: string
          relationship_start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birthday?: string | null
          created_at?: string | null
          favorite_topics?: string[] | null
          goals?: Json | null
          id?: string
          interests?: string[] | null
          preferences?: Json | null
          recent_events?: Json | null
          relationship_milestones?: Json | null
          relationship_stage?: string
          relationship_start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
