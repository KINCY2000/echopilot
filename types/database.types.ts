/**
 * Supabase database types for the `public` schema.
 *
 * Hand-authored from supabase/migrations/*.sql because `supabase gen types`
 * requires a Docker shadow database (unavailable in this environment) even
 * when pointed at a live --db-url. Verified column-for-column against a
 * real Postgres instance with the migrations applied (information_schema
 * introspection). Once a hosted Supabase project exists, regenerate the
 * canonical version with:
 *
 *   npx supabase gen types typescript --project-id <ref> > types/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: Database["public"]["Enums"]["organization_role"];
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: Database["public"]["Enums"]["organization_role"];
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: Database["public"]["Enums"]["organization_role"];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organization_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      google_connections: {
        Row: {
          id: string;
          organization_id: string;
          google_account_email: string;
          access_token_encrypted: string;
          refresh_token_encrypted: string;
          scope: string;
          token_expires_at: string;
          status: Database["public"]["Enums"]["google_connection_status"];
          last_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          google_account_email: string;
          access_token_encrypted: string;
          refresh_token_encrypted: string;
          scope: string;
          token_expires_at: string;
          status?: Database["public"]["Enums"]["google_connection_status"];
          last_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          google_account_email?: string;
          access_token_encrypted?: string;
          refresh_token_encrypted?: string;
          scope?: string;
          token_expires_at?: string;
          status?: Database["public"]["Enums"]["google_connection_status"];
          last_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "google_connections_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      businesses: {
        Row: {
          id: string;
          organization_id: string;
          google_connection_id: string | null;
          google_location_id: string;
          name: string;
          address: string | null;
          phone: string | null;
          website: string | null;
          category: string | null;
          average_rating: number | null;
          review_count: number;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          google_connection_id?: string | null;
          google_location_id: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          website?: string | null;
          category?: string | null;
          average_rating?: number | null;
          review_count?: number;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          google_connection_id?: string | null;
          google_location_id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          website?: string | null;
          category?: string | null;
          average_rating?: number | null;
          review_count?: number;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "businesses_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "businesses_google_connection_id_fkey";
            columns: ["google_connection_id"];
            isOneToOne: false;
            referencedRelation: "google_connections";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          business_id: string;
          google_review_id: string;
          reviewer_name: string;
          reviewer_photo_url: string | null;
          rating: number;
          comment: string | null;
          review_created_at: string;
          language: string | null;
          status: Database["public"]["Enums"]["review_status"];
          sentiment: Database["public"]["Enums"]["review_sentiment"] | null;
          urgency: Database["public"]["Enums"]["review_urgency"] | null;
          themes: string[];
          strengths: string[];
          weaknesses: string[];
          analyzed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          google_review_id: string;
          reviewer_name: string;
          reviewer_photo_url?: string | null;
          rating: number;
          comment?: string | null;
          review_created_at: string;
          language?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          sentiment?: Database["public"]["Enums"]["review_sentiment"] | null;
          urgency?: Database["public"]["Enums"]["review_urgency"] | null;
          themes?: string[];
          strengths?: string[];
          weaknesses?: string[];
          analyzed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          google_review_id?: string;
          reviewer_name?: string;
          reviewer_photo_url?: string | null;
          rating?: number;
          comment?: string | null;
          review_created_at?: string;
          language?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          sentiment?: Database["public"]["Enums"]["review_sentiment"] | null;
          urgency?: Database["public"]["Enums"]["review_urgency"] | null;
          themes?: string[];
          strengths?: string[];
          weaknesses?: string[];
          analyzed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_responses: {
        Row: {
          id: string;
          review_id: string;
          content: string;
          tone: Database["public"]["Enums"]["ai_response_tone"];
          status: Database["public"]["Enums"]["ai_response_status"];
          generated_by: Database["public"]["Enums"]["ai_response_generated_by"];
          created_by: string | null;
          google_reply_error: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          content: string;
          tone?: Database["public"]["Enums"]["ai_response_tone"];
          status?: Database["public"]["Enums"]["ai_response_status"];
          generated_by?: Database["public"]["Enums"]["ai_response_generated_by"];
          created_by?: string | null;
          google_reply_error?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          content?: string;
          tone?: Database["public"]["Enums"]["ai_response_tone"];
          status?: Database["public"]["Enums"]["ai_response_status"];
          generated_by?: Database["public"]["Enums"]["ai_response_generated_by"];
          created_by?: string | null;
          google_reply_error?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_responses_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_responses_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          plan: Database["public"]["Enums"]["subscription_plan"];
          status: Database["public"]["Enums"]["subscription_status"];
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          status?: Database["public"]["Enums"]["subscription_status"];
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          status?: Database["public"]["Enums"]["subscription_status"];
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: true;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string | null;
          type: string;
          title: string;
          body: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id?: string | null;
          type: string;
          title: string;
          body?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string | null;
          type?: string;
          title?: string;
          body?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_recommendations: {
        Row: {
          id: string;
          organization_id: string;
          business_id: string | null;
          type: string;
          title: string;
          description: string;
          priority: Database["public"]["Enums"]["recommendation_priority"];
          status: Database["public"]["Enums"]["recommendation_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          business_id?: string | null;
          type: string;
          title: string;
          description: string;
          priority?: Database["public"]["Enums"]["recommendation_priority"];
          status?: Database["public"]["Enums"]["recommendation_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          business_id?: string | null;
          type?: string;
          title?: string;
          description?: string;
          priority?: Database["public"]["Enums"]["recommendation_priority"];
          status?: Database["public"]["Enums"]["recommendation_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_recommendations_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          organization_id: string;
          actor_id: string | null;
          action: string;
          target_type: string;
          target_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          actor_id?: string | null;
          action: string;
          target_type: string;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          actor_id?: string | null;
          action?: string;
          target_type?: string;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_organization: {
        Args: { p_name: string; p_slug: string };
        Returns: Database["public"]["Tables"]["organizations"]["Row"];
      };
    };
    Enums: {
      organization_role: "owner" | "admin" | "member";
      google_connection_status: "connected" | "expired" | "revoked" | "error";
      review_status: "pending" | "answered" | "ignored";
      review_sentiment: "positive" | "negative" | "neutral" | "mixed";
      review_urgency: "low" | "medium" | "high" | "critical";
      ai_response_status: "draft" | "published" | "failed";
      ai_response_tone: "chaleureux" | "professionnel" | "premium" | "dynamique";
      ai_response_generated_by: "ai" | "human";
      subscription_plan: "trial" | "starter" | "pro" | "business";
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "unpaid";
      recommendation_priority: "low" | "medium" | "high";
      recommendation_status: "new" | "acknowledged" | "dismissed";
    };
  };
};
