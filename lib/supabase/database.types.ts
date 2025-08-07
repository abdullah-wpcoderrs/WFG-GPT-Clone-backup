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
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          sender: Database["public"]["Enums"]["message_sender"]
          content: string
          created_at: string
          metadata: Json | null
          tokens_used: number | null
          response_time_ms: number | null
        }
        Insert: {
          id?: string
          session_id: string
          sender: Database["public"]["Enums"]["message_sender"]
          content: string
          created_at?: string
          metadata?: Json | null
          tokens_used?: number | null
          response_time_ms?: number | null
        }
        Update: {
          id?: string
          session_id?: string
          sender?: Database["public"]["Enums"]["message_sender"]
          content?: string
          created_at?: string
          metadata?: Json | null
          tokens_used?: number | null
          response_time_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_sessions: {
        Row: {
          id: string
          title: string
          user_id: string
          gpt_id: string
          status: Database["public"]["Enums"]["chat_status"]
          created_at: string
          updated_at: string
          message_count: number | null
          context: Json | null
          settings: Json | null
        }
        Insert: {
          id?: string
          title: string
          user_id: string
          gpt_id: string
          status?: Database["public"]["Enums"]["chat_status"]
          created_at?: string
          updated_at?: string
          message_count?: number | null
          context?: Json | null
          settings?: Json | null
        }
        Update: {
          id?: string
          title?: string
          user_id?: string
          gpt_id?: string
          status?: Database["public"]["Enums"]["chat_status"]
          created_at?: string
          updated_at?: string
          message_count?: number | null
          context?: Json | null
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_gpt_id_fkey"
            columns: ["gpt_id"]
            isOneToOne: false
            referencedRelation: "gpts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          name: string
          file_url: string
          file_type: string | null
          file_size: number | null
          uploaded_by: string | null
          team_id: string | null
          gpt_id: string | null
          created_at: string
          updated_at: string
          metadata: Json | null
          is_processed: boolean | null
          processing_status: string | null
        }
        Insert: {
          id?: string
          name: string
          file_url: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          team_id?: string | null
          gpt_id?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json | null
          is_processed?: boolean | null
          processing_status?: string | null
        }
        Update: {
          id?: string
          name?: string
          file_url?: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          team_id?: string | null
          gpt_id?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json | null
          is_processed?: boolean | null
          processing_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_gpt_id_fkey"
            columns: ["gpt_id"]
            isOneToOne: false
            referencedRelation: "gpts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      gpts: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          status: Database["public"]["Enums"]["gpt_status"]
          creator_id: string | null
          team_id: string | null
          created_at: string
          updated_at: string
          prompt: string | null
          model: string | null
          temperature: number | null
          max_tokens: number | null
          usage_count: number | null
          rating: number | null
          tags: string[] | null
          is_public: boolean | null
          web_access: boolean | null
          approval_status: Database["public"]["Enums"]["approval_status"] | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          access_level: Database["public"]["Enums"]["access_level"] | null
          compliance_score: number | null
          monthly_cost: number | null
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          status?: Database["public"]["Enums"]["gpt_status"]
          creator_id?: string | null
          team_id?: string | null
          created_at?: string
          updated_at?: string
          prompt?: string | null
          model?: string | null
          temperature?: number | null
          max_tokens?: number | null
          usage_count?: number | null
          rating?: number | null
          tags?: string[] | null
          is_public?: boolean | null
          web_access?: boolean | null
          approval_status?: Database["public"]["Enums"]["approval_status"] | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          access_level?: Database["public"]["Enums"]["access_level"] | null
          compliance_score?: number | null
          monthly_cost?: number | null
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          status?: Database["public"]["Enums"]["gpt_status"]
          creator_id?: string | null
          team_id?: string | null
          created_at?: string
          updated_at?: string
          prompt?: string | null
          model?: string | null
          temperature?: number | null
          max_tokens?: number | null
          usage_count?: number | null
          rating?: number | null
          tags?: string[] | null
          is_public?: boolean | null
          web_access?: boolean | null
          approval_status?: Database["public"]["Enums"]["approval_status"] | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          access_level?: Database["public"]["Enums"]["access_level"] | null
          compliance_score?: number | null
          monthly_cost?: number | null
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "gpts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gpts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string | null
          created_by: string | null
          team_id: string | null
          created_at: string
          updated_at: string
          settings: Json | null
          deadline: string | null
          progress: number | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: string | null
          created_by?: string | null
          team_id?: string | null
          created_at?: string
          updated_at?: string
          settings?: Json | null
          deadline?: string | null
          progress?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string | null
          created_by?: string | null
          team_id?: string | null
          created_at?: string
          updated_at?: string
          settings?: Json | null
          deadline?: string | null
          progress?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          member_count: number | null
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          member_count?: number | null
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          member_count?: number | null
          settings?: Json | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          content: string
          category: string | null
          created_by: string | null
          team_id: string | null
          created_at: string
          updated_at: string
          usage_count: number | null
          is_public: boolean | null
          tags: string[] | null
          variables: Json | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          content: string
          category?: string | null
          created_by?: string | null
          team_id?: string | null
          created_at?: string
          updated_at?: string
          usage_count?: number | null
          is_public?: boolean | null
          tags?: string[] | null
          variables?: Json | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          content?: string
          category?: string | null
          created_by?: string | null
          team_id?: string | null
          created_at?: string
          updated_at?: string
          usage_count?: number | null
          is_public?: boolean | null
          tags?: string[] | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      usage_analytics: {
        Row: {
          id: string
          user_id: string | null
          gpt_id: string | null
          session_id: string | null
          team_id: string | null
          tokens_used: number | null
          response_time_ms: number | null
          cost: number | null
          created_at: string
          date: string | null
          metrics: Json | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          gpt_id?: string | null
          session_id?: string | null
          team_id?: string | null
          tokens_used?: number | null
          response_time_ms?: number | null
          cost?: number | null
          created_at?: string
          date?: string | null
          metrics?: Json | null
        }
        Update: {
          id?: string
          user_id?: string | null
          gpt_id?: string | null
          session_id?: string | null
          team_id?: string | null
          tokens_used?: number | null
          response_time_ms?: number | null
          cost?: number | null
          created_at?: string
          date?: string | null
          metrics?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_analytics_gpt_id_fkey"
            columns: ["gpt_id"]
            isOneToOne: false
            referencedRelation: "gpts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_analytics_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: Database["public"]["Enums"]["user_role"] | null
          team_id: string | null
          avatar_url: string | null
          status: string | null
          last_active: string | null
          created_at: string
          updated_at: string
          preferences: Json | null
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: Database["public"]["Enums"]["user_role"] | null
          team_id?: string | null
          avatar_url?: string | null
          status?: string | null
          last_active?: string | null
          created_at?: string
          updated_at?: string
          preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          team_id?: string | null
          avatar_url?: string | null
          status?: string | null
          last_active?: string | null
          created_at?: string
          updated_at?: string
          preferences?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_uuid: string
        }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_team_id: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
      is_admin_or_super: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      access_level: "team" | "organization"
      approval_status: "approved" | "pending" | "rejected"
      chat_status: "active" | "completed" | "archived"
      gpt_status: "active" | "inactive" | "pending" | "suspended"
      message_sender: "user" | "gpt"
      risk_level: "low" | "medium" | "high"
      user_role: "user" | "admin" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never