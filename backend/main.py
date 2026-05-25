import os
from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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

app=FastAPI(title="Movie Recommender API",description="API for recommending movies based on user preferences and a specified movie.")

app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_methods=["*"],allow_headers=["*"])

@app.get('/')
def health_check():
    return {'status':'ok'}

@app.post("/recommend")
def recommend(request:RecommendationRequest)->RecommendResponse:
    try:
        from agent import app as agent_app
        result=agent_app.invoke({"prompt": request.prompt,"movie": request.movie,"embedding": [],"candidates":[],"search_results":None,"recommendations":[]})
        return RecommendResponse(recommendations=result["recommendations"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__=="__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
