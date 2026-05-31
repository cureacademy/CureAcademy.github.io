from fastapi import FastAPI
from app.db import init_db
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ping, listserv

app = FastAPI()

init_db()


# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route modules here
app.include_router(ping.router)
app.include_router(listserv.router)