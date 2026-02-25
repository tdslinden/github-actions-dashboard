from fastapi import FastAPI
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
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "GitHub Actions Dashboard API", "version": "0.1.0"}


@app.get("/api/workflows")
async def get_workflows() -> list[WorkflowSummary]:
    """Get latest workflow status for all monitored repos"""
    try:
        workflow_service = WorkflowService()
        workflow_summaries = await workflow_service.get_all_workflows()
        return workflow_summaries
    except Exception as e:
        print(f"Error fetching workflows: {e}")
        logging.error(f"Error fetching workflows: {e}")
        raise HTTPException(status_code=500, detail="Error fetching workflows")


@app.get("/health")
async def health():
    """Health check endpoint"""
    workflow_service = WorkflowService()
    core_rate_limit = await workflow_service.check_rate_limit()
    print(f"Health check - rate limit status: {core_rate_limit}")
    if "error" in core_rate_limit:
        return {"status": "unhealthy", "details": core_rate_limit["error"]}
    return {
        "status": "healthy",
        "remaining_rate_limit": core_rate_limit.get("remaining", "unknown"),
        "rate_limit_reset": core_rate_limit.get("reset", "unknown"),
    }


if __name__ == "__main__":
    import uvicorn
    print("Starting GitHub Actions Dashboard API on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
