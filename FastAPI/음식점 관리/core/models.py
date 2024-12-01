from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from datetime import datetime

from .base import Base

class Table(Base):
    __tablename__ = "tables"
    
    id = Column(Integer, primary_key=True, index=True)
    table_number = Column(Integer, unique=True)
    capacity = Column(Integer)
    status = Column(String)  # available, occupied
    current_order_id = Column(Integer, nullable=True)

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

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"))
    status = Column(String)  # pending, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
