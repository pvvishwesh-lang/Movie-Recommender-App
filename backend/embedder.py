from sentence_transformers import SentenceTransformer

model = None
def get_model():
    global model
    if model is None:
        model = SentenceTransformer('all-MiniLM-L6-v2')
    return model

def generate_embedding(input_text):
    model = get_model()
    return model.encode(input_text, show_progress_bar=False)