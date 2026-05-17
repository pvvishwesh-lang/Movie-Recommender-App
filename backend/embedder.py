import requests
import os

HF_TOKEN = os.environ.get("HF_TOKEN")

def generate_embedding(input_text):
    response = requests.post("https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction", headers={"Authorization": f"Bearer {HF_TOKEN}"},json={"inputs": input_text})
    print(f"HF API status: {response.status_code}")
    print(f"HF API response: {response.text[:200]}")
    result=response.json()
    if isinstance(result, list) and isinstance(result[0], list):
        return result[0]
    return result
    
