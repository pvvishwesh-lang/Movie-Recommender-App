from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_recommend_valid_prompt():
    response = client.post("/recommend", json={"prompt": "dark psychological thrillers","movie": None})
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)
    assert len(data["recommendations"]) > 0
    for rec in data["recommendations"]:
        assert "title" in rec
        assert "overview" in rec
        assert "rating" in rec
        assert "poster_path" in rec
        assert "genres" in rec
        assert "release_date" in rec
        assert "reason" in rec

def test_recommend_missing_prompt():
    response = client.post("/recommend", json={})
    assert response.status_code == 422

def test_recommend_with_movie():
    response = client.post("/recommend", json={"prompt": "something similar","movie": "Inception"})
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
