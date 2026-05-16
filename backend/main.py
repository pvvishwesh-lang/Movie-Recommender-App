from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agent import app as agent_app


class Recommendations(BaseModel):
    title:str
    overview:str
    rating:float
    poster_path:str
    genres:list[str]
    release_date:str
    reason:str
class RecommendResponse(BaseModel):
    recommendations:list[Recommendations]

class RecommendationRequest(BaseModel):
    prompt:str
    movie:str | None=None

app=FastAPI()

app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_methods=["*"],allow_headers=["*"])

@app.get('/')
def health_check():
    return {'status':'ok'}

@app.post("/recommend")
def recommend(request:RecommendationRequest)->RecommendResponse:
    result=agent_app.invoke({"prompt": request.prompt,"movie": request.movie,"embedding": [],"candidates":[],"search_results":None,"recommendations":[]})
    return RecommendResponse(recommendations=result["recommendations"])