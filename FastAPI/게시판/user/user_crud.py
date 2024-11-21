from sqlalchemy.orm import Session

from core.models import User
from user.user_schema import NewUserForm

from passlib.context import CryptContext

from datetime import datetime, timedelta
from jose import jwt
import os
from dotenv import load_dotenv
from user import user_schema
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from core.base import get_db
from jose import JWTError


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password:str, hashed_password:str):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(name:str, db:Session):
    return db.query(User).filter(User.user_name == name).first()

def create_user(new_user:NewUserForm, db:Session):
    user = User(
        user_name=new_user.name,
        email=new_user.email,
        hashed_pw=pwd_context.hash(new_user.password),
    )
    db.add(user)
    db.commit()
    return user

### data를 JWT로 생성하는 함수
# data: 토큰에 담을 데이터
# expires_delta: 토큰의 만료 시간을 설정
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    # 토큰의 만료 시간이 있다면 토큰의 만료 시간을 설정
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    # 그렇지 않으면 기본 만료 시간을 15분으로 설정
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    # 토큰에 만료 시간을 추가
    to_encode.update({"exp": expire})
    # jwt.encode 함수를 사용하여 to_encode 딕셔너리를 JWT로 인코딩
    # SECRET_KEY: 토큰을 서명의 비밀 키, ALGORITHM: 암호화 알고리즘
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


#  JWT를 사용하여 현재 사용자를 확인 함수
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # credentials_exception 변수를 사용하여 예외 처리 설정
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # jwt.decode 함수를 사용하여 토큰을 디코딩하여 페이로드를 가져옴
        # SECRET_KEY: 토큰을 서명의 비밀 키, ALGORITHM: 암호화 알고리즘
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # 페이로드에서 서브젝트(sub)를 가져와서 username 변수에 할당
        # sub는 일반적으로 JWT에서 사용자를 식별하는 주체(subject)를 나타냅니다.
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    # 예외 발생 시 credentials_exception 예외를 발생시킴
    except JWTError:
        raise credentials_exception
    # 토큰에서 가져온 username을 가진 사용자 정보를 가져옴
    user = get_user(username, db)
    # 사용자 정보가 없다면 credentials_exception 예외를 발생시킴
    if user is None:
        raise credentials_exception
    return user
