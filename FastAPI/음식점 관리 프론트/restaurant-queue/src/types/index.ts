// types/index.ts
export interface Queue {
    queue_number: string;   // queueNumber -> queue_number
    customer_name: string;  // customerName -> customer_name
    party_size: number;     // partySize -> party_size
    estimated_wait_time: number;  // estimatedWaitTime -> estimated_wait_time
    status: 'waiting' | 'called' | 'seated' | 'cancelled';
    created_at: string;     // createdAt -> created_at
    phone_number: string;   // 백엔드 스키마에 있는 필드 추가
  }
  
  export interface Table {
    table_number: string;   // tableNumber -> table_number
    capacity: number;
    status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  }
  
  export interface MenuItem {
    menu_item_id: number;   // id -> menu_item_id
    name: string;
    description: string;
    price: number;
    category: string;
    image_url?: string;     // image -> image_url
  }
  
  export interface Order {
    order_id: number;       // id -> order_id
    table_id: number;       // tableId -> table_id
    items: OrderItem[];
    status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid';
    total_amount: number;   // totalAmount -> total_amount
    created_at: string;     // createdAt -> created_at
  }
  
  export interface OrderItem {
    menu_item_id: number;   // menuItemId -> menu_item_id
    quantity: number;
    notes?: string;
  }
  
  // API 요청/응답을 위한 추가 인터페이스들
  export interface QueueCreate {
    customer_name: string;
    party_size: number;
    phone_number: string;
  }
  
  export interface QueueResponse {
    queue_number: string;
    estimated_wait_time: number;
    position: number;
    qr_code: string;
  }