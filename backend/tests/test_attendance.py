import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    try:
        db = TestSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="function")
def setup_database():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

def test_today_stats(setup_database):
    response = client.get("/api/attendance/stats/today")
    assert response.status_code == 200
    data = response.json()
    assert "total_employees" in data
    assert "present_today" in data
    assert "attendance_rate" in data

def test_get_today_attendance(setup_database):
    response = client.get("/api/attendance/today")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
