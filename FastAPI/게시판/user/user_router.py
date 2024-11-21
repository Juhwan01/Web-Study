from sqlalchemy.orm import Session
from core.base import get_db
from user.user_schema import NewUserForm

from fastapi import APIRouter, Depends, HTTPException, Response
from user import user_crud
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from .user_schema import *
import os
from dotenv import load_dotenv
from core.models import User


load_dotenv()

ACCESS_TOKEN_EXPIRE_MINUTES = float(os.getenv("ACCESS_TOKEN_EXPIRE",30))

app=APIRouter(
    prefix="/user"
)

@app.post("/signup", description="회원가입")
async def signup(new_user:NewUserForm, db:Session=Depends(get_db)):
    # 회원 존재 여부 확인
    user = user_crud.get_user(new_user.name,db)

    if user:
        raise HTTPException(status_code=400, detail="이미 가입된 회원입니다.")
    
    user_crud.create_user(new_user, db)

    return HTTPException(status_code=200, detail="회원가입이 완료되었습니다.")

@app.post("/login", description="로그인")
async def login(response: Response,login_form:OAuth2PasswordRequestForm = Depends(),db:Session=Depends(get_db)):
    # 회원 존재 여부 확인
    user = user_crud.get_user(login_form.username,db)

    if not user:
        raise HTTPException(status_code=400, detail="가입되지 않은 회원입니다.")
    
    # 로그인
    res = user_crud.verify_password(login_form.password, user.hashed_pw)

    # 토큰 생성
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = user_crud.create_access_token(data={"sub":user.user_name}, expires_delta=access_token_expires)

    # 보안 쿠키 설정
    response.set_cookie(
        key="access_token",
        value=access_token,
        expires=access_token_expires,
        httponly=True
    )

    if not res:
        raise HTTPException(status_code=400, detail="비밀번호가 일치하지 않습니다.")
    
    return  Token(access_token=access_token, token_type="bearer")

# 현재 사용자 정보를 반환하는 함수
@app.get("/me", response_model=UserDTO)
async def read_users_me(
    user: User = Depends(user_crud.get_current_user)
):
    current_user = UserDTO(
        id=user.user_no,
        user_name=user.user_name,
        email=user.email
    )
    return current_user


    