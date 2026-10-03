import re
from typing import List

from app.services.kb_service import load_all_kb


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def search_kb(question: str, limit: int = 5):
    query = normalize_text(question)
    items = load_all_kb()
    scored = []

    for item in items:
        haystack = normalize_text(f"{item.get('title', '')} {item.get('problem', '')} {item.get('solution', '')} {item.get('keywords', '')}")
        score = 0
        for word in query.split():
            if word and word in haystack:
                score += 1
        if score > 0:
            scored.append({"item": item, "score": score})

    scored.sort(key=lambda x: x["score"], reverse=True)
    return [entry["item"] for entry in scored[:limit]]


def build_answer_from_kb(question: str) -> str:
    matches = search_kb(question)
    if not matches:
        return "Je n'ai pas trouvé de correspondance exacte dans la base de connaissances locale. Je peux toutefois vous guider avec les étapes de diagnostic standard."

    best = matches[0]
    title = best.get("title", "Dépannage technique")
    problem = best.get("problem", "")
    solution = best.get("solution", "")
    steps = best.get("steps", [])

    answer = f"Probablement lié à : {title}.\n\n"
    if problem:
        answer += f"Symptôme : {problem}\n\n"
    answer += f"Solution recommandée : {solution}\n"
    if steps:
        answer += "\nÉtapes :\n"
        for index, step in enumerate(steps, start=1):
            answer += f"{index}. {step}\n"
    return answer


def answer_question(question: str) -> str:
    from app.services.llm_service import generate_llm_answer

    kb_answer = build_answer_from_kb(question)
    llm_answer = generate_llm_answer(question)

    if llm_answer and "Je n'ai pas pu obtenir" not in llm_answer:
        return f"{llm_answer}\n\n--- Réponse locale recommandée ---\n{kb_answer}"

    return kb_answer
