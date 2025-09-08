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
      internet_search_cache: {
        Row: {
          id: string
          query_hash: string
          query: string
          provider: Database["public"]["Enums"]["search_provider"]
          results: Json
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          query_hash: string
          query: string
          provider: Database["public"]["Enums"]["search_provider"]
          results: Json
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          query_hash?: string
          query?: string
          provider?: Database["public"]["Enums"]["search_provider"]
          results?: Json
          created_at?: string
          expires_at?: string
        }
        Relationships: []
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
      pdf_generation_jobs: {
        Row: {
          id: string
          session_id: string
          user_id: string
          team_id: string
          prompt: string
          content: string | null
          file_url: string | null
          status: string
          error_message: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          team_id: string
          prompt: string
          content?: string | null
          file_url?: string | null
          status?: string
          error_message?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          team_id?: string
          prompt?: string
          content?: string | null
          file_url?: string | null
          status?: string
          error_message?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pdf_generation_jobs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pdf_generation_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pdf_generation_jobs_team_id_fkey"
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
      document_chunks: {
        Row: {
          id: string
          document_id: string
          chunk_index: number
          chunk_type: Database["public"]["Enums"]["chunk_type"] | null
          content: string
          metadata: Json | null
          word_count: number | null
          char_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          chunk_index: number
          chunk_type?: Database["public"]["Enums"]["chunk_type"] | null
          content: string
          metadata?: Json | null
          word_count?: number | null
          char_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          chunk_index?: number
          chunk_type?: Database["public"]["Enums"]["chunk_type"] | null
          content?: string
          metadata?: Json | null
          word_count?: number | null
          char_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          }
        ]
      }
      document_embeddings: {
        Row: {
          id: string
          chunk_id: string
          embedding: number[] | null
          model: Database["public"]["Enums"]["embedding_model"] | null
          created_at: string
        }
        Insert: {
          id?: string
          chunk_id: string
          embedding?: number[] | null
          model?: Database["public"]["Enums"]["embedding_model"] | null
          created_at?: string
        }
        Update: {
          id?: string
          chunk_id?: string
          embedding?: number[] | null
          model?: Database["public"]["Enums"]["embedding_model"] | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_embeddings_chunk_id_fkey"
            columns: ["chunk_id"]
            isOneToOne: false
            referencedRelation: "document_chunks"
            referencedColumns: ["id"]
          }
        ]
      }
      gpt_context_documents: {
        Row: {
          id: string
          gpt_id: string
          document_id: string
          added_by: string
          added_at: string
          is_active: boolean | null
          priority: number | null
        }
        Insert: {
          id?: string
          gpt_id: string
          document_id: string
          added_by: string
          added_at?: string
          is_active?: boolean | null
          priority?: number | null
        }
        Update: {
          id?: string
          gpt_id?: string
          document_id?: string
          added_by?: string
          added_at?: string
          is_active?: boolean | null
          priority?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gpt_context_documents_gpt_id_fkey"
            columns: ["gpt_id"]
            isOneToOne: false
            referencedRelation: "gpts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gpt_context_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gpt_context_documents_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      enhanced_memory_items: {
        Row: {
          id: string
          session_id: string
          user_id: string
          team_id: string
          content: string
          embedding: number[] | null
          importance_score: number | null
          access_count: number | null
          last_accessed_at: string | null
          created_at: string
          updated_at: string
          tags: string[] | null
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          team_id: string
          content: string
          embedding?: number[] | null
          importance_score?: number | null
          access_count?: number | null
          last_accessed_at?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[] | null
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          team_id?: string
          content?: string
          embedding?: number[] | null
          importance_score?: number | null
          access_count?: number | null
          last_accessed_at?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "enhanced_memory_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enhanced_memory_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enhanced_memory_items_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
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
      get_cached_search_results: {
        Args: {
          p_query: string
          p_provider: Database["public"]["Enums"]["search_provider"]
        }
        Returns: Json
      }
      cache_search_results: {
        Args: {
          p_query: string
          p_provider: Database["public"]["Enums"]["search_provider"]
          p_results: Json
        }
        Returns: string
      }
      chunk_document: {
        Args: {
          p_document_id: string
          p_content: string
          p_chunk_size?: number
          p_overlap?: number
        }
        Returns: number
      }
      find_similar_documents: {
        Args: {
          p_query_embedding: number[]
          p_gpt_id?: string | null
          p_team_id?: string | null
          p_limit?: number
          p_similarity_threshold?: number
        }
        Returns: {
          chunk_id: string
          document_id: string
          document_name: string
          chunk_content: string
          similarity: number
          chunk_index: number
        }[]
      }
      get_chat_context: {
        Args: {
          p_session_id: string
          p_query_embedding: number[]
          p_max_tokens?: number
        }
        Returns: {
          content: string
          source_type: string
          relevance_score: number
        }[]
      }
      add_document_to_gpt_context: {
        Args: {
          p_gpt_id: string
          p_document_id: string
          p_user_id: string
          p_priority?: number
        }
        Returns: string
      }
      remove_document_from_gpt_context: {
        Args: {
          p_gpt_id: string
          p_document_id: string
        }
        Returns: boolean
      }
      update_memory_importance: {
        Args: {
          p_memory_id: string
        }
        Returns: undefined
      }
      create_context_window: {
        Args: {
          p_session_id: string
          p_context_data: Json
          p_embedding: number[]
        }
        Returns: string
      }
      search_all_content: {
        Args: {
          p_query: string
          p_user_id: string
          p_team_id: string
          p_limit?: number
        }
        Returns: {
          content_id: string
          content_type: string
          title: string
          content_snippet: string
          relevance_score: number
          created_at: string
        }[]
      }
    }
    Enums: {
      access_level: "team" | "organization"
      approval_status: "approved" | "pending" | "rejected"
      chat_status: "active" | "completed" | "archived"
      gpt_status: "active" | "inactive" | "pending" | "suspended"
      message_sender: "user" | "gpt"
      risk_level: "low" | "medium" | "high"
      search_provider: "google" | "bing" | "duckduckgo"
      user_role: "user" | "admin" | "super_admin"
      chunk_type: "text" | "table" | "image" | "code" | "header"
      embedding_model: "text-embedding-ada-002" | "text-embedding-3-small" | "text-embedding-3-large"
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