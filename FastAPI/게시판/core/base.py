from sqlalchemy import create_engine # DB 연결
from sqlalchemy.ext.declarative import declarative_base # 모델 클래스 정의
from sqlalchemy.orm import sessionmaker # DB 작업 수행행
import os

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:0313@localhost:5432/study"

engine=create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base() # 모델 클래스의 상위 클래스

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()