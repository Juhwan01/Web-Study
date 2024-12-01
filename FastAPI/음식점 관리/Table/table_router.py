from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.base import get_db
from Table import table_crud
from Table.table_schema import *

router = APIRouter()

@router.get("/tables/", response_model=List[Table])
def read_tables(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tables = table_crud.get_tables(db, skip=skip, limit=limit)
    return tables

@router.post("/tables/", response_model=Table)
def create_table(table: TableCreate, db: Session = Depends(get_db)):
    return table_crud.create_table(db=db, table=table)

@router.patch("/tables/{table_number}", response_model=Table)
def update_table_status(
    table_number: int,
    table_update: TableUpdate,
    db: Session = Depends(get_db)
):
    db_table = table_crud.update_table(db, table_number, table_update)
    if db_table is None:
        raise HTTPException(status_code=404, detail="Table not found")
    return db_table