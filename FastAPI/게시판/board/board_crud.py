from sqlalchemy.orm import Session
from sqlalchemy import and_

from core.models import Board
from board.board_schema import NewPost, PostList,Post, UpdatePost

def insert_post(new_post:NewPost, db:Session):
    post = Board(
        writer=new_post.writer,
        title=new_post.title,
        content=new_post.content
    )
    db.add(post)
    db.commit()

    return post.no

def list_all_post(db:Session):
    lists = db.query(Board).filter(Board.del_yn == 'Y').all() # del_yn이 Y인 것만 조회
    return lists

def get_post(post_no:int, db:Session):
    try:
        post = db.query(Board).filter(and_(Board.no == post_no, Board.del_yn == 'Y')).first()
        return post
    except Exception as e:
        return {"error":str(e), "msg":"해당 게시글이 없습니다."}

def update_post(update_post:UpdatePost, db:Session):
    post = db.query(Board).filter(and_(Board.no == update_post.no, Board.del_yn == 'Y')).first()
    try:
        if not post:
            raise Exception("해당 게시글이 없습니다.")
        
        post.title = update_post.title
        post.content = update_post.content
        db.commit()
        db.refresh(post)
        return get_post(post.no, db)
    
    except Exception as e:
        return {"error":str(e), "msg":"게시글 수정에 실패하였습니다."}
    
def alter_del_yn(post_no:int, db:Session):
    post = db.query(Board).filter(and_(Board.no == post_no, Board.del_yn == 'Y')).first()
    try:
        if not post:
            raise Exception("해당 게시글이 없습니다.")
        
        post.del_yn = 'N'
        db.commit()
        db.refresh(post)
        return {"msg":"게시글이 삭제되었습니다."}
    
    except Exception as e:
        return {"error":str(e), "msg":"게시글 삭제에 실패하였습니다."}