export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string;
          role: "USER" | "ADMIN";
          created_at: string;
        };
        Insert: {
          id: string;
          nickname: string;
          role?: "USER" | "ADMIN";
          created_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string;
          role?: "USER" | "ADMIN";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      guests: {
        Row: {
          id: string;
          phone: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          password_hash?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      dreams: {
        Row: {
          id: string;
          user_id: string | null;
          guest_id: string | null;
          content: string;
          expert_type: string;
          status: "PENDING" | "COMPLETED" | "FAILED";
          analysis_result: Json | null;
          image_url: string | null;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          guest_id?: string | null;
          content: string;
          expert_type: string;
          status: "PENDING" | "COMPLETED" | "FAILED";
          analysis_result?: Json | null;
          image_url?: string | null;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          guest_id?: string | null;
          content?: string;
          expert_type?: string;
          status?: "PENDING" | "COMPLETED" | "FAILED";
          analysis_result?: Json | null;
          image_url?: string | null;
          is_public?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dreams_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dreams_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          dream_id: string;
          amount: number;
          payment_key: string | null;
          status: "READY" | "DONE" | "CANCELED";
          approved_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          dream_id: string;
          amount: number;
          payment_key?: string | null;
          status: "READY" | "DONE" | "CANCELED";
          approved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          dream_id?: string;
          amount?: number;
          payment_key?: string | null;
          status?: "READY" | "DONE" | "CANCELED";
          approved_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_dream_id_fkey";
            columns: ["dream_id"];
            isOneToOne: true;
            referencedRelation: "dreams";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
