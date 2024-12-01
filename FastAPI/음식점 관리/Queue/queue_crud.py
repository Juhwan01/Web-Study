from sqlalchemy.orm import Session
from core.models import Queue
from .queue_schema import QueueCreate, QueueUpdate
from datetime import datetime
import qrcode

def get_queue(db: Session, queue_number: str):
    return db.query(Queue).filter(Queue.queue_number == queue_number).first()

def get_queues(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Queue).offset(skip).limit(limit).all()

def get_active_queues(db: Session):
    return db.query(Queue).filter(Queue.status == "waiting").all()

def create_queue(db: Session, queue: QueueCreate):
    queue_number = f"W{datetime.now().strftime('%Y%m%d%H%M%S')}"
    estimated_wait_time = calculate_wait_time(db)
    
    db_queue = Queue(
        **queue.dict(),
        queue_number=queue_number,
        status="waiting",
        estimated_wait_time=estimated_wait_time
    )
    db.add(db_queue)
    db.commit()
    db.refresh(db_queue)
    return db_queue

def update_queue(db: Session, queue_number: str, queue_update: QueueUpdate):
    db_queue = get_queue(db, queue_number)
    if not db_queue:
        return None
    
    for key, value in queue_update.dict(exclude_unset=True).items():
        setattr(db_queue, key, value)
    
    db.commit()
    db.refresh(db_queue)
    return db_queue

def calculate_wait_time(db: Session) -> float:
    active_queues = get_active_queues(db)
    # 간단한 대기 시간 계산 로직
    base_wait_time = 15  # 기본 15분
    return base_wait_time * len(active_queues)

def get_queue_position(db: Session, queue_number: str) -> int:
    """대기열에서의 현재 위치 계산"""
    target_queue = get_queue(db, queue_number)
    if not target_queue or target_queue.status != "waiting":
        return 0
        
    position = db.query(Queue).filter(
        Queue.status == "waiting",
        Queue.created_at <= target_queue.created_at
    ).count()
    
    return position
