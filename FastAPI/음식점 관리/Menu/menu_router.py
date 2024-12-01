from fastapi import APIRouter, Depends, HTTPException
from Menu.menu_crud import *
from Menu.menu_schema import MenuItem 

router = APIRouter()

@router.get("/menu/", response_model=List[MenuItem])
def read_menu(db: Session = Depends(get_db)):
    return menu_crud.get_menu_items(db)

@router.post("/menu/", response_model=MenuItem)
def create_menu_item(item: MenuItemCreate, db: Session = Depends(get_db)):
    return menu_crud.create_menu_item(db=db, item=item)

@router.patch("/menu/{item_id}", response_model=MenuItem)
def update_menu_item(item_id: int, item: MenuItemCreate, db: Session = Depends(get_db)):
    return menu_crud.update_menu_item(db=db, item_id=item_id, item=item)