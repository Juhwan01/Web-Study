from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.base import get_db
from Queue import queue_crud
from Queue.queue_schema import *
from utils.qrcode_generator import generate_queue_qr

router = APIRouter()

@router.post("/queue/", response_model=QueueResponse)
async def create_queue(
    queue: QueueCreate, 
    db: Session = Depends(get_db),
    base_url: str = "http://localhost:3000/queue/"  # 프론트엔드 URL
):
    db_queue = queue_crud.create_queue(db=db, queue=queue)
    
    # 현재 대기 위치 계산
    position = queue_crud.get_queue_position(db, db_queue.queue_number)
    
    # QR 코드 생성
    qr_code = generate_queue_qr(db_queue.queue_number, base_url)
    
    return {
        "queue_number": db_queue.queue_number,
        "estimated_wait_time": db_queue.estimated_wait_time,
        "position": position,
        "qr_code": qr_code
    }

@router.get("/queue/scan/{queue_number}")
async def scan_queue(queue_number: str, db: Session = Depends(get_db)):
    """QR 코드 스캔 시 호출되는 엔드포인트"""
    queue = queue_crud.get_queue(db, queue_number=queue_number)
    if not queue:
        raise HTTPException(status_code=404, detail="Queue not found")
    
    # 현재 대기 상태 정보 반환
    position = queue_crud.get_queue_position(db, queue_number)
    return {
        "status": queue.status,
        "position": position,
        "estimated_wait_time": queue.estimated_wait_time,
        "customer_name": queue.customer_name,
        "party_size": queue.party_size,
        "created_at": queue.created_at
    }

@router.get("/queue/{queue_number}", response_model=Queue)
def read_queue(queue_number: str, db: Session = Depends(get_db)):
    db_queue = queue_crud.get_queue(db, queue_number=queue_number)
    if db_queue is None:
        raise HTTPException(status_code=404, detail="Queue not found")
    return db_queue

@router.get("/queues/", response_model=List[Queue])
def read_queues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    queues = queue_crud.get_queues(db, skip=skip, limit=limit)
    return queues

@router.patch("/queue/{queue_number}", response_model=Queue)
def update_queue_status(
    queue_number: str,
    queue_update: QueueUpdate,
    db: Session = Depends(get_db)
):
    db_queue = queue_crud.update_queue(db, queue_number, queue_update)
    if db_queue is None:
        raise HTTPException(status_code=404, detail="Queue not found")
    return db_queue



