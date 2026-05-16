from qdrant_client import QdrantClient
from qdrant_client.models import Distance, QueryResponse
import os

CLUSTER_ENDPOINT=os.environ.get('CLUSTER_ENDPOINT')
QDRANT_API_KEY=os.environ.get('QDRANT_API_KEY')


client=QdrantClient(url=CLUSTER_ENDPOINT,api_key=QDRANT_API_KEY)

def search_movies(embedding,limit=10):
    results=client.query_points(collection_name='movies',query=embedding,limit=limit).points
    data=[{"title": r.payload["title"],"overview": r.payload["overview"],"rating": r.payload["rating"],"poster_path": r.payload["poster_path"],"genres": r.payload["genres"],"release_date": r.payload["release_date"],"score": r.score} for r in results]
    return data