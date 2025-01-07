from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()




@app.get("/")
def index() -> str:
    return "it workedd"
