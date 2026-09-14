/**
 * Database types for Supabase.
 *
 * This is a hand-written subset that matches `supabase/migrations`. Once your
 * schema is live you can regenerate a complete, always-accurate version with:
 *
 *   npx supabase gen types typescript --project-id <your-project-id> \
 *     --schema public > src/types/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          is_seller: boolean;
          stripe_customer_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_seller?: boolean;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_seller?: boolean;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          slug: string;
          description: string | null;
          price_cents: number;
          currency: string;
          image_url: string | null;
          category: string | null;
          inventory: number;
          status: "draft" | "active" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          title: string;
          slug: string;
          description?: string | null;
          price_cents: number;
          currency?: string;
          image_url?: string | null;
          category?: string | null;
          inventory?: number;
          status?: "draft" | "active" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          price_cents?: number;
          currency?: string;
          image_url?: string | null;
          category?: string | null;
          inventory?: number;
          status?: "draft" | "active" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey";
            columns: ["seller_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string | null;
          status: "pending" | "paid" | "fulfilled" | "cancelled" | "refunded";
          total_cents: number;
          currency: string;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id?: string | null;
          status?: "pending" | "paid" | "fulfilled" | "cancelled" | "refunded";
          total_cents: number;
          currency?: string;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string | null;
          status?: "pending" | "paid" | "fulfilled" | "cancelled" | "refunded";
          total_cents?: number;
          currency?: string;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          title: string;
          unit_price_cents: number;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          title: string;
          unit_price_cents: number;
          quantity: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          title?: string;
          unit_price_cents?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      decrement_inventory: {
        Args: { p_product_id: string; p_quantity: number };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
