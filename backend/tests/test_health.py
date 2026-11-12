from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_ok() -> None:
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_cors_mengizinkan_frontend_lokal() -> None:
    res = client.get("/api/health", headers={"Origin": "http://localhost:5173"})
    assert res.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_cors_menolak_origin_lain() -> None:
    res = client.get("/api/health", headers={"Origin": "https://contoh-asing.com"})
    assert "access-control-allow-origin" not in res.headers
