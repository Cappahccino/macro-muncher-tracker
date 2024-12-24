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
      activity_logs: {
        Row: {
          activity_log_id: string
          calories: number | null
          carbs: number | null
          created_at: string | null
          date: string
          fat: number | null
          fiber: number | null
          protein: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activity_log_id?: string
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          date: string
          fat?: number | null
          fiber?: number | null
          protein?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activity_log_id?: string
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          date?: string
          fat?: number | null
          fiber?: number | null
          protein?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ingredients: {
        Row: {
          calories_per_100g: number | null
          carbs_per_100g: number | null
          created_at: string | null
          fat_per_100g: number | null
          fiber_per_100g: number | null
          ingredient_id: string
          name: string
          protein_per_100g: number | null
          updated_at: string | null
        }
        Insert: {
          calories_per_100g?: number | null
          carbs_per_100g?: number | null
          created_at?: string | null
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          ingredient_id?: string
          name: string
          protein_per_100g?: number | null
          updated_at?: string | null
        }
        Update: {
          calories_per_100g?: number | null
          carbs_per_100g?: number | null
          created_at?: string | null
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          ingredient_id?: string
          name?: string
          protein_per_100g?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string | null
          custom_calories: number | null
          custom_carbs: number | null
          custom_fat: number | null
          custom_fiber: number | null
          custom_protein: number | null
          fat: number | null
          fiber: number | null
          ingredient_id: string | null
          protein: number | null
          quantity_g: number
          recipe_id: string | null
          recipe_ingredient_id: string
          updated_at: string | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          custom_calories?: number | null
          custom_carbs?: number | null
          custom_fat?: number | null
          custom_fiber?: number | null
          custom_protein?: number | null
          fat?: number | null
          fiber?: number | null
          ingredient_id?: string | null
          protein?: number | null
          quantity_g: number
          recipe_id?: string | null
          recipe_ingredient_id?: string
          updated_at?: string | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          custom_calories?: number | null
          custom_carbs?: number | null
          custom_fat?: number | null
          custom_fiber?: number | null
          custom_protein?: number | null
          fat?: number | null
          fiber?: number | null
          ingredient_id?: string | null
          protein?: number | null
          quantity_g?: number
          recipe_id?: string | null
          recipe_ingredient_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["ingredient_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string | null
          description: string | null
          instructions: Json | null
          recipe_id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          instructions?: Json | null
          recipe_id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          instructions?: Json | null
          recipe_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          activity_level:
            | Database["public"]["Enums"]["activity_level_type"]
            | null
          created_at: string | null
          date_of_birth: string | null
          dietary_preferences: Json | null
          email: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          height_cm: number | null
          preferred_height_unit:
            | Database["public"]["Enums"]["height_unit_type"]
            | null
          preferred_weight_unit:
            | Database["public"]["Enums"]["weight_unit_type"]
            | null
          updated_at: string | null
          user_id: string
          username: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?:
            | Database["public"]["Enums"]["activity_level_type"]
            | null
          created_at?: string | null
          date_of_birth?: string | null
          dietary_preferences?: Json | null
          email: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height_cm?: number | null
          preferred_height_unit?:
            | Database["public"]["Enums"]["height_unit_type"]
            | null
          preferred_weight_unit?:
            | Database["public"]["Enums"]["weight_unit_type"]
            | null
          updated_at?: string | null
          user_id?: string
          username: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?:
            | Database["public"]["Enums"]["activity_level_type"]
            | null
          created_at?: string | null
          date_of_birth?: string | null
          dietary_preferences?: Json | null
          email?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height_cm?: number | null
          preferred_height_unit?:
            | Database["public"]["Enums"]["height_unit_type"]
            | null
          preferred_weight_unit?:
            | Database["public"]["Enums"]["weight_unit_type"]
            | null
          updated_at?: string | null
          user_id?: string
          username?: string
          weight_kg?: number | null
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
      activity_level_type:
        | "sedentary"
        | "lightly active"
        | "moderately active"
        | "very active"
        | "extremely active"
      gender_type: "male" | "female" | "other"
      height_unit_type: "cm" | "ft"
      weight_unit_type: "kg" | "lbs" | "st"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
