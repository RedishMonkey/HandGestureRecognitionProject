from fastapi import FastAPI, Path, Query, HTTPException
from typing import Optional, Dict
from pydantic import BaseModel

app = FastAPI()

class Image(BaseModel):
    imageName: str
    imageId: int
    data: int = None


@app.get("/")
def root():
    return {"state": "server is running"}

@app.get("/get-image/{image_name}")
def getImage(image_name: str, image_id: Optional[int] = Query(3,description="the image id", ge=3, le=5)):
    return {"image_name":image_name, "image_id":image_id}

@app.post("/put-image/{image_type}")
def put_image(image_type: str, image: Image):
    return {
        "image_type": image_type,
        "image_name": image.imageName,
        "image_id": image.imageId,
        "data": image.data
    }
