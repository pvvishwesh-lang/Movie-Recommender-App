from embedder import generate_embedding

def test_generate_embedding():
    input_text = "The Matrix is a science fiction film released in 1999."
    embedding = generate_embedding(input_text)
    assert isinstance(embedding, list), "Embedding should be a list"
    assert len(embedding) == 384, "Embedding should have 384 dimensions"
    assert all(isinstance(x, (int, float)) for x in embedding), "All values should be floats"