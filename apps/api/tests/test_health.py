import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_health_check():
    """Test the root/health endpoint to ensure the API starts and responds."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == settings.APP_NAME
    assert "version" in data
    assert "health" in data

def test_docs_available():
    """Test that OpenAPI docs are available."""
    response = client.get("/docs")
    assert response.status_code == 200