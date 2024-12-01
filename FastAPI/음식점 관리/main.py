from fastapi import FastAPI
from Queue import queue_router
from Table import table_router
from Order import analytics
from Menu import menu_router

app = FastAPI(title="Restaurant Queue Management System")

# 라우터 등록
app.include_router(queue_router.router, tags=["queue"])
app.include_router(table_router.router, tags=["table"])
app.include_router(analytics.router, tags=["analytics"])
app.include_router(menu_router.router, tags=["menu"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Restaurant Queue Management System"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)