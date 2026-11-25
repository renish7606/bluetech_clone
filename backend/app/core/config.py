import os
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / 'data'
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./enquiries.db')
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
