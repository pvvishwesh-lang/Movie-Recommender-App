#!pip install sentence-transformers qdrant-client requests tqdm
import gzip
import json
import requests
from datetime import datetime
import time
import os
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
date=datetime.now().strftime("%m_%d_%Y")
url=f"http://files.tmdb.org/p/exports/movie_ids_{date}.json.gz"
response=requests.get(url)
with open("movie_ids.json.gz", "wb") as f:
    f.write(response.content)
movie_ids=[]
with gzip.open("movie_ids.json.gz", "rt") as f:
    for line in f:
        movie=json.loads(line)
        movie_ids.append(movie["id"])
print(f"Total movie IDs: {len(movie_ids)}")
TMDB_API_KEY = os.environ.get("VITE_API_KEY")
def fetch_movie_details(movie_id):
    try:
        response=requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}",params={"api_key": TMDB_API_KEY},timeout=5)
        if response.status_code==200:
            return response.json()
        return None
    except:
        return None
movies=[]
failed=[]
with ThreadPoolExecutor(max_workers=40) as executor:
    futures={executor.submit(fetch_movie_details, mid): mid for mid in movie_ids}
    for i,future in enumerate(tqdm(as_completed(futures),total=len(movie_ids))):
        result = future.result()
        if result:
            movies.append(result)
        else:
            failed.append(futures[future])
        if (i + 1) % 5000 == 0:
          with open("movies_progress.json", "w") as f:
            json.dump(movies, f)
          print(f"Saved {len(movies)} valid movies")
print(f"Successfully fetched: {len(movies)}")
print(f"Failed: {len(failed)}")
#with open("movies_progress.json", "r") as f:
    #movies = json.load(f)
#print(f"Loaded {len(movies)} movies")
QDRANT_API_KEY=os.environ.get("QDRANT_API_KEY")
CLUSTER_ENDPOINT=os.environ.get("CLUSTER_ENDPOINT")
model = SentenceTransformer('all-MiniLM-L6-v2')
client = QdrantClient(url=CLUSTER_ENDPOINT, api_key=QDRANT_API_KEY)
def build_text(movie):
    genres = movie.get("genres", [])
    if isinstance(genres, list):
        genre_str=" ".join([g["name"] for g in genres if isinstance(g, dict)])
    else:
        genre_str=genres
    return f"{movie['title']} | {genre_str} | {movie['overview']}"
movies=[m for m in movies if m.get("overview") and m.get("title")]
def embed_and_upsert(movies,batch_size=100):
    total_upserted=0
    for i in tqdm(range(0,len(movies),batch_size)):
        batch=movies[i:i + batch_size]
        texts=[build_text(m) for m in batch]
        embeddings=model.encode(texts, show_progress_bar=False)
        points=[]
        for j,(movie, embedding) in enumerate(zip(batch,embeddings)):
            points.append(PointStruct(id=abs(hash(str(movie["id"]))) % (2**63),vector=embedding.tolist(),payload={"title": movie.get("title", ""),"overview": movie.get("overview", ""),"rating": float(movie.get("rating", movie.get("vote_average", 0))),"poster_path": movie.get("poster_path", ""),"genres": " ".join([g["name"] for g in movie.get("genres", [])]),"release_date": movie.get("release_date", "")}))
        client.upsert(collection_name="movies",points=points)
        total_upserted+=len(points)
        if (i // batch_size) % 50==0:
            print(f"Upserted {total_upserted} movies to Qdrant")
    return total_upserted
total=embed_and_upsert(movies)
print(f"Done loading {total} movies in Qdrant")
collection_info=client.get_collection("movies")
print(collection_info)