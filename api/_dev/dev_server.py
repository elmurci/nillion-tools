from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from blindfold_encrypt import handler as blindfold_encrypt_handler
from blindfold_decrypt import handler as blindfold_decrypt_handler
from typing import List
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DecryptRequest(BaseModel):
    shares: List[str]
    cluster_size: int
    threshold: int

class EncryptRequest(BaseModel):
    secret: str
    cluster_size: int
    threshold: int

@app.post("/api/blindfold/encrypt")
def blindfold(request: EncryptRequest):
    return blindfold_encrypt_handler(request.secret, request.threshold, request.cluster_size)

@app.post("/api/blindfold/decrypt")
def blindfold(request: DecryptRequest):
    return blindfold_decrypt_handler(request.shares, request.threshold, request.cluster_size)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("dev_server:app", host="0.0.0.0", port=3001, reload=True)