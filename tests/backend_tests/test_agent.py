from agent import embed_prompt,query_sources,generate_recommendations,fetch_poster_and_rating,format_response
from embedder import generate_embedding
from vector_store import search_movies

def test_embed_prompt():
    state={'prompt': 'I want to watch a sci-fi movie', 'movie': 'Inception'}
    result=embed_prompt(state)
    assert 'embedding' in result
    assert isinstance(result['embedding'], list)    

def test_query_sources():
    state={'embedding': [0.1, 0.2, 0.3]}
    result=query_sources(state)
    assert 'candidates' in result or 'search_results' in result

def test_generate_recommendations():
    state={'prompt': 'I want to watch a sci-fi movie', 'candidates': [{'title': 'Interstellar', 'overview': 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', 'rating': 8.6, 'poster_path': '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'genres': 'Adventure, Drama, Science Fiction', 'release_date': '2014-11-05'}]}
    result=generate_recommendations(state)
    assert 'recommendations' in result
    assert isinstance(result['recommendations'], list)
    assert len(result['recommendations']) >= 1

def test_fetch_poster_and_rating():
    title='Inception'
    result=fetch_poster_and_rating(title)
    assert 'poster_path' in result
    assert 'rating' in result
    assert isinstance(result['poster_path'], str)
    assert isinstance(result['rating'], float)

def test_format_response():
    state = {'recommendations': [{'title': 'Interstellar', 'overview': 'A team...', 'rating': 8.6, 'poster_path': '/path.jpg', 'genres': 'Adventure', 'release_date': '2014-11-05', 'reason': 'Great sci-fi'}]}
    result = format_response(state)
    assert 'recommendations' in result
    assert isinstance(result['recommendations'], list)
    for rec in result['recommendations']:
        assert 'title' in rec
        assert 'poster_path' in rec
        assert 'rating' in rec

