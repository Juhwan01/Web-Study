from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class QueueBase(BaseModel):
    customer_name: str
    party_size: int
    phone_number: Optional[str]

class QueueCreate(QueueBase):
    pass

class QueueUpdate(BaseModel):
    status: str
    seated_at: Optional[datetime]

class Queue(QueueBase):
    id: int
    queue_number: str
    status: str
    created_at: datetime
    estimated_wait_time: float
    seated_at: Optional[datetime]

    class Config:
        from_attributes = True

class QueueResponse(BaseModel):
    queue_number: str
    estimated_wait_time: float
    position: int
    qr_code: str  # base64 encoded QR image