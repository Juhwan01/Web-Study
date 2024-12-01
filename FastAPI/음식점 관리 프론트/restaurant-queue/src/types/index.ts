// types/index.ts

// Menu Types
export interface MenuItem {
    id: number;
    name: string;
    price: number;
    description: string | null;
    category: string;
    is_available: boolean;
  }
  
  export interface MenuItemCreate {
    name: string;
    price: number;
    description?: string;
    category: string;
    is_available: boolean;
  }
  
  // Order Types
  export interface OrderItem {
    menu_item_id: number;
    quantity: number;
    notes?: string;
  }
  
  export interface OrderCreate {
    table_id: number;
    items: OrderItem[];
  }
  
  export interface OrderUpdate {
    status: string;
    completed_at?: string;
  }
  
  export interface Order {
    id: number;
    table_id: number;
    items: OrderItem[];
    status: string;
    created_at: string;
    completed_at?: string;
    total_amount: number;
  }
  
  // Queue Types
  export interface QueueCreate {
    customer_name: string;
    party_size: number;
    phone_number?: string;
  }
  
  export interface QueueUpdate {
    status: string;
    seated_at?: string;
  }
  
  export interface QueueResponse {
    queue_number: string;
    estimated_wait_time: number;
    position: number;
    qr_code: string;
  }
  
  export interface Queue {
    id: number;
    queue_number: string;
    customer_name: string;
    party_size: number;
    phone_number?: string;
    status: string;
    created_at: string;
    estimated_wait_time: number;
    seated_at?: string;
  }
  
  export interface QueueScanResponse {
    status: string;
    position: number;
    estimated_wait_time: number;
    customer_name: string;
    party_size: number;
    created_at: string;
  }
  
  // Table Types
  export interface TableCreate {
    table_number: number;
    capacity: number;
  }
  
  export interface TableUpdate {
    status: string;
    current_order_id?: number;
  }
  
  export interface Table {
    id: number;
    table_number: number;
    capacity: number;
    status: string;
    current_order_id?: number;
  }
  
  // API 요청 파라미터 타입
  export interface PaginationParams {
    skip?: number;
    limit?: number;
  }