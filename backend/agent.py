from typing import TypedDict
from langgraph.graph import StateGraph,END
from embedder import generate_embedding
from vector_store import search_movies
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_groq import ChatGroq
import os
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
import json


GROQ_API_KEY=os.environ.get('GROQ_API_KEY')

class AgentState(TypedDict):
    prompt: str
    movie: str | None
    embedding: list
    candidates: list
    search_results: str | None
    recommendations: list
graph = StateGraph(AgentState)


def embed_prompt(state: AgentState) -> AgentState:
    userPrompt=state['prompt']
    userMovie=state['movie']
    text=f"{userPrompt} {userMovie}" if userMovie else userPrompt
    embedded_text=generate_embedding(text)
    return {'embedding':embedded_text}

def query_sources(state: AgentState) -> AgentState:
    embedding=state["embedding"]
    candidates=search_movies(embedding)
    filtered=[c for c in candidates if c.get('rating', 0) >= 6.5]
    if not filtered or filtered[0]['score'] < 0.3:
        search=DuckDuckGoSearchRun()
        search_results=search.run(f"movie recommendations {state['prompt']}")
        return {'search_results':search_results}
    return {'candidates':filtered}

def generate_recommendations(state: AgentState) -> AgentState:
    llm=ChatGroq(model="llama-3.1-8b-instant",api_key=GROQ_API_KEY,temperature=0.7)
    parser=JsonOutputParser(pydantic_object={"type": "object","properties": {'title':{'type':'string'},'overview':{'type':'string'},'rating':{'type':'float'},'poster_path':{'type':'string'},'genres':{'type':'string'},'release_date':{'type':'string'},'reason':{'type':'string'}}})
    prompt=ChatPromptTemplate.from_messages([("system","""You are a movie recommendation expert.Given a user's request and a list of candidate movies, pick the best matches with ratings above 6.5 out of 10, which is not a documentary of the movie itself, which is not a short film or an experimental film, focuses on narrative feature, and explain why each one matches.Return a JSON array of objects with fields: title, overview, rating, poster_path, genres, release_date, reason.Return ONLY the JSON array, no other text."""),("user", "{input}")])
    candidates=state.get('candidates')
    search_results=state.get('search_results')
    if candidates:
        context=f"Candidate movies from database:\n{json.dumps(candidates, indent=2)}"
    else:
        context=f"Web search results:\n{search_results}"
    input_text=f"User request: {state['prompt']}\n\n{context}"
    chain=prompt|llm|parser
    result=chain.invoke({'input':input_text})
    return {'recommendations':result}
    

def fetch_poster(title):
    import requests
    try:
        response=requests.get("https://api.themoviedb.org/3/search/movie",params={"api_key": os.environ.get("VITE_API_KEY"), "query": title}, timeout=5)
        results = response.json().get("results", [])
        if results and results[0].get("poster_path"):
            return results[0]["poster_path"]
        return ""
    except:
        return ""

def format_response(state: AgentState) -> AgentState:
    recommendations=state.get('recommendations',[])
    cleaned=[]
    for rec in recommendations:
        genres=rec.get("genres", [])
        if isinstance(genres, str):
            genres=genres.split(" ")
        elif isinstance(genres, list):
            genres=[g["name"] if isinstance(g, dict) else str(g) for g in genres]
        cleaned.append({"title": rec.get("title", ""),"overview": rec.get("overview", ""),"rating": float(rec.get("rating", 0)),"poster_path": fetch_poster(rec.get("title", "")),"genres": genres,"release_date": rec.get("release_date", ""),"reason": rec.get("reason", "")})
    return {'recommendations':cleaned}
graph.add_node("embed_prompt", embed_prompt)
graph.add_node("query_sources", query_sources)
graph.add_node("generate_recommendations", generate_recommendations)
graph.add_node("format_response", format_response)
graph.set_entry_point("embed_prompt")
graph.add_edge("embed_prompt", "query_sources")
graph.add_edge("query_sources", "generate_recommendations")
graph.add_edge("generate_recommendations", "format_response")
graph.add_edge("format_response", END)
app = graph.compile()
