import json
import os
from typing import List

import httpx

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1")


def generate_llm_answer(question: str) -> str:
    try:
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": (
                "Tu es un assistant technique expert. Réponds en français, de manière claire et structurée. "
                "Donne la cause probable, les vérifications à faire, et une solution simple. "
                f"Question: {question}"
            ),
            "stream": False,
        }
        response = httpx.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload, timeout=20)
        response.raise_for_status()
        data = response.json()
        generated = data.get("response", "")
        if generated.strip():
            return generated.strip()
    except Exception:
        pass

    return "Je n'ai pas pu obtenir de réponse depuis le modèle local. Voici une réponse basée sur les règles de dépannage locales."
