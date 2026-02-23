from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services import WorkflowService
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

app = FastAPI(title="GitHub Actions Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

workflow_service = WorkflowService()


@app.get("/")
async def root():
    return {"message": "GitHub Actions Dashboard API", "version": "0.1.0"}


@app.get("/api/workflows")
async def get_workflows():
    """Get latest workflow status for all monitored repos"""
    summaries = await workflow_service.get_all_workflows()
    return summaries


@app.get("/health")
async def health():
    """Health check endpoint"""
    # TODO: Add rate limit check here
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
