from sentence_transformers import SentenceTransformer


model=SentenceTransformer('all-MiniLM-L6-v2')

def generate_embedding(input_text):
    return model.encode(input_text, show_progress_bar=False)