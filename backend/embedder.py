import requests
import os

HF_TOKEN = os.environ.get("HF_TOKEN")


def generate_embedding(input_text):
    response = requests.post("https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2", headers={"Authorization": f"Bearer {HF_TOKEN}"},json={"inputs": input_text})
    print(f"HF API status: {response.status_code}")
    print(f"HF API response: {response.text[:200]}")
    result=response.json()
    if isinstance(result, list) and isinstance(result[0], list):
        return result[0]
    return result