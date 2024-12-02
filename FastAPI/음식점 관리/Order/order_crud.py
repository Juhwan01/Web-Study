from sqlalchemy.orm import Session
from sqlalchemy import func
from Order.order_schema import OrderCreate, OrderUpdate
from core.models import Order, OrderItem, MenuItem
from datetime import datetime, timedelta
from typing import Dict, List

def create_order(db: Session, order: OrderCreate):
    # 새 주문 생성
    db_order = Order(
        table_id=order.table_id,
        status="pending"
    )
    db.add(db_order)
    db.flush()  # ID 생성을 위해 flush
    
    # 주문 항목 생성
    order_items = []
    total_amount = 0
    
    for item in order.items:
        menu_item = db.query(MenuItem).get(item.menu_item_id)
        if not menu_item:
            raise ValueError(f"Menu item {item.menu_item_id} not found")
            
        order_item = OrderItem(
            order_id=db_order.id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity,
            price=menu_item.price,
            notes=item.notes
        )
        order_items.append(order_item)
        total_amount += menu_item.price * item.quantity
    
    db.bulk_save_objects(order_items)
    db_order.total_amount = total_amount
    db.commit()
    db.refresh(db_order)
    
    return db_order

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def get_table_orders(db: Session, table_id: int):
    return db.query(Order)\
        .filter(Order.table_id == table_id)\
        .order_by(Order.created_at.desc())\
        .all()

def update_order(db: Session, order_id: int, order_update: OrderUpdate):
    db_order = get_order(db, order_id)
    if not db_order:
        return None
    
    for key, value in order_update.dict(exclude_unset=True).items():
        setattr(db_order, key, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def calculate_total_amount(order_items: List[OrderItem]) -> float:
    total = 0
    for item in order_items:
        menu_item = MenuItem.get(item.menu_item_id)  # 메뉴 아이템의 가격 조회
        if menu_item:
            total += menu_item.price * item.quantity
    return total

def analyze_table_turnover(db: Session) -> Dict:
    yesterday = datetime.utcnow() - timedelta(days=1)
    
    # 테이블별 주문 및 완료 시간 조회
    orders = db.query(Order)\
        .filter(
            Order.created_at >= yesterday,
            Order.status == "completed",
            Order.completed_at.isnot(None)
        ).all()
    
    table_stats = {}
    for order in orders:
        if order.table_id not in table_stats:
            table_stats[order.table_id] = {
                "total_orders": 0,
                "total_duration": 0,
                "total_amount": 0,
                "min_duration": float('inf'),
                "max_duration": 0
            }
        
        duration = (order.completed_at - order.created_at).total_seconds() / 3600  # 시간 단위
        stats = table_stats[order.table_id]
        stats["total_orders"] += 1
        stats["total_duration"] += duration
        stats["total_amount"] += order.total_amount
        stats["min_duration"] = min(stats["min_duration"], duration)
        stats["max_duration"] = max(stats["max_duration"], duration)
    
    # 통계 계산
    for table_id, stats in table_stats.items():
        stats["average_duration"] = stats["total_duration"] / stats["total_orders"]
        stats["turnover_rate"] = 24 / stats["average_duration"]  # 24시간 기준 회전율
        stats["average_amount"] = stats["total_amount"] / stats["total_orders"]
        if stats["min_duration"] == float('inf'):
            stats["min_duration"] = 0
    
    return table_stats

def analyze_peak_hours(db: Session) -> Dict:
    yesterday = datetime.utcnow() - timedelta(days=1)
    
    # 시간대별 주문 수와 총 매출액 분석
    hourly_stats = db.query(
        func.strftime("%H", Order.created_at).label('hour'),
        func.count(Order.id).label('order_count'),
        func.sum(Order.total_amount).label('total_amount')
    ).filter(
        Order.created_at >= yesterday
    ).group_by(
        'hour'
    ).all()
    
    # 결과 포맷팅
    peak_hours = {}
    for hour, order_count, total_amount in hourly_stats:
        hour_int = int(hour)
        peak_hours[hour_int] = {
            "order_count": order_count,
            "total_amount": float(total_amount) if total_amount else 0,
            "average_amount": float(total_amount)/order_count if order_count else 0
        }
        
    # 피크 시간대 식별
    if peak_hours:
        max_orders_hour = max(peak_hours.items(), key=lambda x: x[1]["order_count"])[0]
        max_amount_hour = max(peak_hours.items(), key=lambda x: x[1]["total_amount"])[0]
        peak_hours["peak_hours"] = {
            "by_order_count": max_orders_hour,
            "by_total_amount": max_amount_hour
        }
    
    return peak_hours

def get_daily_statistics(db: Session) -> Dict:
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # 기본 통계 쿼리
    daily_stats = db.query(
        func.count(Order.id).label('total_orders'),
        func.sum(Order.total_amount).label('total_amount'),
        func.avg(Order.total_amount).label('average_order_amount')
    ).filter(
        Order.created_at >= today_start
    ).first()
    
    # 완료된 주문 통계
    completed_stats = db.query(
        func.count(Order.id).label('completed_orders')
    ).filter(
        Order.created_at >= today_start,
        Order.status == "completed"
    ).scalar()
    
    # 취소된 주문 통계
    cancelled_stats = db.query(
        func.count(Order.id).label('cancelled_orders')
    ).filter(
        Order.created_at >= today_start,
        Order.status == "cancelled"
    ).scalar()
    
    # 테이블 회전율
    table_count = db.query(func.count(Table.id)).scalar()
    if table_count > 0:
        turnover_rate = (daily_stats.total_orders or 0) / table_count
    else:
        turnover_rate = 0
    
    # 고객 통계
    customer_stats = db.query(
        func.sum(Queue.party_size).label('total_customers'),
        func.avg(Queue.party_size).label('average_party_size')
    ).filter(
        Queue.created_at >= today_start
    ).first()
    
    stats = {
        "date": today_start.date(),
        "orders": {
            "total_orders": daily_stats.total_orders or 0,
            "completed_orders": completed_stats or 0,
            "cancelled_orders": cancelled_stats or 0,
            "completion_rate": (completed_stats / daily_stats.total_orders * 100) if daily_stats.total_orders else 0
        },
        "revenue": {
            "total_amount": float(daily_stats.total_amount or 0),
            "average_order_amount": float(daily_stats.average_order_amount or 0)
        },
        "customers": {
            "total_customers": customer_stats.total_customers or 0,
            "average_party_size": float(customer_stats.average_party_size or 0)
        },
        "operations": {
            "table_count": table_count,
            "table_turnover_rate": turnover_rate,
            "average_amount_per_table": float(daily_stats.total_amount or 0) / table_count if table_count else 0
        }
    }
    
    return stats

def get_orders(db: Session):
    return db.query(Order).all()