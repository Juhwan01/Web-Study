from typing import Optional
from pydantic import BaseModel  

class MenuItemBase(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    category: str
    is_available: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: int

    class Config:
        from_attributes = True