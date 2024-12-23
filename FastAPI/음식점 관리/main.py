from fastapi import FastAPI
from Queue import queue_router
from Table import table_router
from Order import analytics, order_router
from Menu import menu_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Restaurant Queue Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(queue_router.router, tags=["queue"])
app.include_router(table_router.router, tags=["table"])
app.include_router(analytics.router, tags=["analytics"])
app.include_router(menu_router.router, tags=["menu"])
app.include_router(order_router.router, tags=["order"])


@app.get("/")
def read_root():
    return {"message": "Welcome to Restaurant Queue Management System"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)