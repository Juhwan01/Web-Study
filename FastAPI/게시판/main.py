from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from board import board_router
from user import user_router
import uvicorn
app=FastAPI()

# cors 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(board_router.app, tags=["board"])
app.include_router(user_router.app, tags=["user"])
@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)