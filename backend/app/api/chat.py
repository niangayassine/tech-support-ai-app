from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag_service import answer_question

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat_endpoint(payload: ChatRequest):
    response = answer_question(payload.message)
    return {"answer": response}
