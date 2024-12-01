from pydantic import BaseModel
from typing import Optional

class TableBase(BaseModel):
    table_number: int
    capacity: int

class TableCreate(TableBase):
    pass

class TableUpdate(BaseModel):
    status: Optional[str]
    current_order_id: Optional[int]

class Table(TableBase):
    id: int
    status: str
    current_order_id: Optional[int]

    class Config:
        from_attributes = True