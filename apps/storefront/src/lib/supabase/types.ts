export type UserRole = 'CUSTOMER' | 'ADMIN'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED'
export type QuoteStatus = 'PENDING' | 'REVIEWING' | 'QUOTED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string
          image: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          image?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string | null
          image?: string | null
          role?: UserRole
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          image_url: string | null
          images: string[] | null
          category: string | null
          sort_order: number
          is_active: boolean
          price: number | null
          mesh_file_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          image_url?: string | null
          images?: string[] | null
          category?: string | null
          sort_order?: number
          is_active?: boolean
          price?: number | null
          mesh_file_id?: string | null
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          image_url?: string | null
          images?: string[] | null
          category?: string | null
          sort_order?: number
          is_active?: boolean
          price?: number | null
          mesh_file_id?: string | null
          updated_at?: string
        }
      }
      mesh_files: {
        Row: {
          id: string
          original_filename: string
          stored_filename: string | null
          storage_path: string | null
          file_type: string
          file_size: number
          s3_key: string | null
          s3_bucket: string | null
          volume_mm3: number | null
          surface_area_mm2: number | null
          bounding_box_x: number | null
          bounding_box_y: number | null
          bounding_box_z: number | null
          is_processed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          original_filename: string
          stored_filename?: string | null
          storage_path?: string | null
          file_type: string
          file_size: number
          s3_key?: string | null
          s3_bucket?: string | null
          volume_mm3?: number | null
          surface_area_mm2?: number | null
          bounding_box_x?: number | null
          bounding_box_y?: number | null
          bounding_box_z?: number | null
          is_processed?: boolean
        }
        Update: {
          stored_filename?: string | null
          storage_path?: string | null
          s3_key?: string | null
          s3_bucket?: string | null
          volume_mm3?: number | null
          surface_area_mm2?: number | null
          bounding_box_x?: number | null
          bounding_box_y?: number | null
          bounding_box_z?: number | null
          is_processed?: boolean
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string | null
          type: string
          first_name: string
          last_name: string
          address: string
          apartment: string | null
          city: string
          state: string
          zip: string
          country: string
          phone: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label?: string | null
          type?: string
          first_name: string
          last_name: string
          address: string
          apartment?: string | null
          city: string
          state: string
          zip: string
          country?: string
          phone?: string | null
          is_default?: boolean
        }
        Update: {
          label?: string | null
          type?: string
          first_name?: string
          last_name?: string
          address?: string
          apartment?: string | null
          city?: string
          state?: string
          zip?: string
          country?: string
          phone?: string | null
          is_default?: boolean
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: OrderStatus
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          shipping_method: string
          shipping_address: Record<string, unknown>
          payment_method: string | null
          payment_status: PaymentStatus
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          email: string
          phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          status?: OrderStatus
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          shipping_method: string
          shipping_address: Record<string, unknown>
          payment_method?: string | null
          payment_status?: PaymentStatus
          razorpay_order_id?: string | null
          email: string
          phone?: string | null
          notes?: string | null
        }
        Update: {
          status?: OrderStatus
          payment_status?: PaymentStatus
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          name: string
          slug: string | null
          material: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          name: string
          slug?: string | null
          material?: string | null
          quantity: number
          unit_price: number
          total_price: number
        }
        Update: Record<string, never>
      }
      quote_requests: {
        Row: {
          id: string
          quote_number: string
          user_id: string | null
          status: QuoteStatus
          name: string
          email: string
          company: string | null
          phone: string | null
          service: string
          material: string
          quantity: number
          notes: string | null
          quoted_price: number | null
          response_notes: string | null
          responded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_number: string
          user_id?: string | null
          status?: QuoteStatus
          name: string
          email: string
          company?: string | null
          phone?: string | null
          service: string
          material: string
          quantity: number
          notes?: string | null
        }
        Update: {
          status?: QuoteStatus
          quoted_price?: number | null
          response_notes?: string | null
          responded_at?: string | null
          updated_at?: string
        }
      }
      quote_files: {
        Row: {
          id: string
          quote_request_id: string
          original_filename: string
          stored_filename: string
          s3_key: string
          s3_bucket: string
          file_size: number
          file_type: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          quote_request_id: string
          original_filename: string
          stored_filename: string
          s3_key: string
          s3_bucket: string
          file_size: number
          file_type: string
        }
        Update: Record<string, never>
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          ip_address: string | null
          user_agent: string | null
          metadata: Record<string, unknown> | null
          status: 'SUCCESS' | 'FAILED' | 'BLOCKED'
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Record<string, unknown> | null
          status?: 'SUCCESS' | 'FAILED' | 'BLOCKED'
          error_message?: string | null
        }
        Update: Record<string, never>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
      payment_status: PaymentStatus
      quote_status: QuoteStatus
    }
  }
}
