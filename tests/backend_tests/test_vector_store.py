from vector_store import get_client,search_movies
from embedder import generate_embedding


def test_qdrant_connection():
    client = get_client()
    assert client is not None, "Failed to connect to Qdrant"    
def test_search_movies():
    embedding = generate_embedding("space adventure sci-fi")
    results = search_movies(embedding)
    assert isinstance(results, list), "Search results should be a list"
    assert len(results) > 0, "Search should return at least one result"
    for movie in results:
        assert "title" in movie, "Movie should have a title"
        assert "overview" in movie, "Movie should have an overview"
        assert "rating" in movie, "Movie should have a rating"  
        assert "poster_path" in movie, "Movie should have a poster path"
        assert "genres" in movie, "Movie should have genres"
        assert "release_date" in movie, "Movie should have a release date"
        assert "score" in movie, "Movie should have a score"
