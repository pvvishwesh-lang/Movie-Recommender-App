import requests
import os

HF_TOKEN = os.environ.get("HF_TOKEN")


def generate_embedding(input_text):
    response = requests.post("https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2", headers={"Authorization": f"Bearer {HF_TOKEN}"},json={"inputs": input_text})
    return response.json()