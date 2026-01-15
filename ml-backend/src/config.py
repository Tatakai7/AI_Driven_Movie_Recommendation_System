import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/movie-recommendation')
PORT = int(os.getenv('ML_PORT', 5001))
NODE_BACKEND_URL = os.getenv('NODE_BACKEND_URL', 'http://localhost:5000')
