from qdrant_client import QdrantClient
from qdrant_client.models import Distance, QueryResponse
import os

CLUSTER_ENDPOINT=os.environ.get('CLUSTER_ENDPOINT')
QDRANT_API_KEY=os.environ.get('QDRANT_API_KEY')

client = None

def get_client():
    global client
    if client is None:
        client=QdrantClient(url=CLUSTER_ENDPOINT,api_key=QDRANT_API_KEY)
    return client

def search_movies(embedding,limit=10):
    client=get_client()
    results=client.query_points(collection_name='movies',query=embedding,limit=limit).points
    data=[{"title": r.payload["title"],"overview": r.payload["overview"],"rating": r.payload["rating"],"poster_path": r.payload["poster_path"],"genres": r.payload["genres"],"release_date": r.payload["release_date"],"score": r.score} for r in results]
    return data