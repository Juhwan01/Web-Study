from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class OrderItem(BaseModel):
    menu_item_id: int  # price 대신 menu_item_id 사용
    quantity: int
    notes: Optional[str]
    
class OrderBase(BaseModel):
    table_id: int
    items: List[OrderItem]

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: str
    completed_at: Optional[datetime]

class Order(OrderBase):
    id: int
    status: str
    created_at: datetime
    completed_at: Optional[datetime]
    total_amount: float

    class Config:
        from_attributes = True