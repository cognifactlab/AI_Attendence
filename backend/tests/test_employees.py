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

def test_create_employee(setup_database):
    response = client.post("/api/employees/", json={
        "name": "John Doe",
        "email": "john@example.com",
        "department": "Engineering",
        "position": "Developer",
        "join_date": "2024-01-01"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"

def test_get_employees(setup_database):
    # Create an employee first
    client.post("/api/employees/", json={
        "name": "John Doe",
        "email": "john@example.com",
        "department": "Engineering",
        "position": "Developer",
        "join_date": "2024-01-01"
    })
    
    response = client.get("/api/employees/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
