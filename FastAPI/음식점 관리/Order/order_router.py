from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.base import get_db
from Order import order_crud
from Order.order_schema import *

router = APIRouter()

@router.post("/orders/", response_model=Order)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    return order_crud.create_order(db=db, order=order)

@router.get("/orders/{order_id}", response_model=Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = order_crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.get("/orders/", response_model=List[Order])
def read_orders(db: Session = Depends(get_db)):
    return order_crud.get_orders(db)

@router.get("/tables/{table_id}/orders", response_model=List[Order])
def read_table_orders(table_id: int, db: Session = Depends(get_db)):
    return order_crud.get_table_orders(db, table_id=table_id)

@router.patch("/orders/{order_id}", response_model=Order)
def update_order_status(
    order_id: int,
    order_update: OrderUpdate,
    db: Session = Depends(get_db)
):
    db_order = order_crud.update_order(db, order_id, order_update)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order