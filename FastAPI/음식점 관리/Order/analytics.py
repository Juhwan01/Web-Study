from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict
from core.base import get_db
from Order.order_crud import *
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/analytics/table-turnover")
def get_table_turnover(db: Session = Depends(get_db)):
    return analyze_table_turnover(db)

@router.get("/analytics/peak-hours")
def get_peak_hours(db: Session = Depends(get_db)):
    return analyze_peak_hours(db)

@router.get("/analytics/daily-stats")
def get_daily_stats(db: Session = Depends(get_db)):
    return get_daily_statistics(db)
