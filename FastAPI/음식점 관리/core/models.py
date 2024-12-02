from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from .base import Base

class Table(Base):
    __tablename__ = "tables"
    
    id = Column(Integer, primary_key=True, index=True)
    table_number = Column(Integer, unique=True)
    capacity = Column(Integer)
    status = Column(String)  # available, occupied
    current_order_id = Column(Integer, nullable=True)
    
    orders = relationship("Order", back_populates="table")

class Queue(Base):
    __tablename__ = "queues"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    party_size = Column(Integer)
    queue_number = Column(String, unique=True)
    status = Column(String)  # waiting, seated, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    estimated_wait_time = Column(Float)
    seated_at = Column(DateTime, nullable=True)
    phone_number = Column(String, nullable=True)

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.table_number"))
    status = Column(String)
    total_amount = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    table = relationship("Table", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    quantity = Column(Integer)
    price = Column(Float)
    notes = Column(String, nullable=True)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem")



class MenuItem(Base):
    __tablename__ = "menu_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Float)
    description = Column(String, nullable=True)
    category = Column(String)
    is_available = Column(Boolean, default=True)