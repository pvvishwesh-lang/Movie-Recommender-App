import os
import requests
import time
from datetime import datetime, timedelta
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
TMDB_API_KEY = os.environ.get("VITE_API_KEY")  
QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY")
QDRANT_URL = os.environ.get("CLUSTER_ENDPOINT")
def get_changed_movie_ids():
    yesterday=(datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    today=datetime.now().strftime("%Y-%m-%d")
    try:
        response=requests.get(f'https://api.themoviedb.org/3/movie/changes', params={'api_key': TMDB_API_KEY, 'start_date': yesterday, 'end_date': today})
        data=response.json()
        return [change['id'] for change in data.get('results', [])]
    except:
        return []
def fetch_movie_details(movie_id):
    try:
        response=requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}",params={"api_key": TMDB_API_KEY},timeout=5)
        if response.status_code==200:
            data=response.json()
            if data.get("overview") and data.get("title"):
                return {"id": str(data["id"]), "title": data["title"], "overview": data["overview"], "rating": data.get("vote_average", 0),"poster_path": data.get("poster_path", ""),"genres": " ".join([g["name"] for g in data.get("genres", [])]),"release_date": data.get("release_date", "")}
        return None
    except:
        return None
def build_text(movie):
    return f"{movie['title']} | {movie['genres']} | {movie['overview']}"
def embed_and_upsert(movies):
    model=SentenceTransformer('all-MiniLM-L6-v2')
    client=QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    texts=[build_text(m) for m in movies]
    embeddings=model.encode(texts, batch_size=64, show_progress_bar=True)
    points=[]
    for movie, embedding in zip(movies, embeddings):
        points.append(PointStruct(id=abs(hash(movie["id"])) % (2**63),vector=embedding.tolist(),payload={"title": movie["title"],"overview": movie["overview"],"rating": float(movie["rating"]),"poster_path": movie["poster_path"],"genres": movie["genres"],"release_date": movie["release_date"]}))
    client.upsert(collection_name="movies", points=points)
    print(f"Upserted {len(points)} movies to Qdrant")
if __name__ == "__main__":
    print('Starting incremental load')
    movie_ids=get_changed_movie_ids()
    print('Found changed movies')
    if not movie_ids:
        print('No changes found')
        exit(0)
    movies=[]
    for movie_id in movie_ids:
        movie=fetch_movie_details(movie_id)
        if movie:
            movies.append(movie)    
        time.sleep(0.025)
    embed_and_upsert(movies)
    print('Finished incremental load')