import json
from pathlib import Path


def get_repo_root() -> Path:
    return Path(__file__).resolve().parents[3]


def load_kb(file_name: str):
    kb_dir = get_repo_root() / "kb"
    file_path = kb_dir / file_name
    if not file_path.exists():
        return []

    with file_path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def load_all_kb():
    items = []
    for file_name in ["faq.json", "hardware.json", "network.json", "software.json"]:
        items.extend(load_kb(file_name))
    return items
