from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services import WorkflowService
from app.models import WorkflowSummary
from app.github_client import GitHubClient
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

app = FastAPI(title="GitHub Actions Dashboard API")

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


workflow_service = WorkflowService()


@app.get("/")
async def root():
    return {"message": "GitHub Actions Dashboard API", "version": "0.1.0"}


@app.get("/api/workflows")
async def get_workflows() -> list[WorkflowSummary]:
    """Get latest workflow status for all monitored repos"""
    try:
        workflow_summaries = await workflow_service.get_all_workflows()
        return workflow_summaries
    except Exception as e:
        logging.error(f"Error fetching workflows: {e}")
        raise HTTPException(status_code=500, detail="Error fetching workflows")


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    logging.info("Starting GitHub Actions Dashboard API on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
