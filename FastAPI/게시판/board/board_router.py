from sqlalchemy.orm import Session
from core.base import get_db
from fastapi import APIRouter, Depends
from board import board_crud
from board.board_schema import NewPost,UpdatePost,PostList
from typing import List

app = APIRouter(
    prefix="/board",
)

@app.post("/create", description="게시글 작성")
async def create_new_post(new_post:NewPost, db:Session = Depends(get_db)):
    return board_crud.insert_post(new_post, db)

@app.get("/read",description="게시글 조회")
async def read_all_post(db:Session = Depends(get_db)):
    return board_crud.list_all_post(db)

@app.get("/read/{post_no}", description="게시글 상세 조회")
async def read_post(post_no:int, db:Session = Depends(get_db)):
    return board_crud.get_post(post_no, db)

@app.put("/update/{post_no}", description="게시글 수정")
async def update_post(update_post:UpdatePost, db:Session = Depends(get_db)):
    return board_crud.update_post(update_post, db)

@app.patch("/delete/{post_no}", description="게시글 삭제")
async def delete_post_yn(post_no:int, db:Session = Depends(get_db)):
    return board_crud.alter_del_yn(post_no, db)
