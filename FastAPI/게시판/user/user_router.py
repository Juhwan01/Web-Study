from sqlalchemy.orm import Session
from core.base import get_db
from user.user_schema import NewUserForm

from fastapi import APIRouter, Depends, HTTPException
from user import user_crud
from fastapi.security import OAuth2PasswordRequestForm

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
async def login(login_form:OAuth2PasswordRequestForm = Depends(),db:Session=Depends(get_db)):
    # 회원 존재 여부 확인
    user = user_crud.get_user(login_form.username,db)

    if not user:
        raise HTTPException(status_code=400, detail="가입되지 않은 회원입니다.")
    
    # 로그인
    res = user_crud.verify_password(login_form.password, user.hashed_pw)

    if not res:
        raise HTTPException(status_code=400, detail="비밀번호가 일치하지 않습니다.")
    
    return  HTTPException(status_code=200, detail="로그인 성공")


    