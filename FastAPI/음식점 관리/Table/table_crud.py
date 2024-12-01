from sqlalchemy.orm import Session
from core.models import *
from .table_schema import TableCreate, TableUpdate

def get_table(db: Session, table_number: int):
    return db.query(Table).filter(Table.table_number == table_number).first()

def get_tables(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Table).offset(skip).limit(limit).all()

def get_available_tables(db: Session, party_size: int):
    return db.query(Table)\
        .filter(Table.status == "available")\
        .filter(Table.capacity >= party_size)\
        .order_by(Table.capacity)\
        .all()

def create_table(db: Session, table: TableCreate):
    db_table = Table(**table.dict(), status="available")
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    return db_table

def update_table(db: Session, table_number: int, table_update: TableUpdate):
    db_table = get_table(db, table_number)
    if not db_table:
        return None
    
    for key, value in table_update.dict(exclude_unset=True).items():
        setattr(db_table, key, value)
    
    db.commit()
    db.refresh(db_table)
    return db_table
