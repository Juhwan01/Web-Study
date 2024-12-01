from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.base import get_db
from Menu import menu_crud
from Menu.menu_schema import MenuItemCreate
from core.models import MenuItem

def create_menu_item(db: Session, item: MenuItemCreate):
    db_item = MenuItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_menu_items(db: Session):
    return db.query(MenuItem).filter(MenuItem.is_available == True).all()

def update_menu_item(db: Session, item_id: int, item: MenuItemCreate):
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    db.commit()
    return db_item