from fastapi import APIRouter, HTTPException, status
from app.schemas.match import MatchRequest, MatchResponse
from app.services.match_analysis import MatchAnalysisService

router = APIRouter()

@router.post("/compare", response_model=MatchResponse)
def compare_resume_to_job(request: MatchRequest):
    """
    Compares raw extracted resume text with a target job description and returns detailed ATS matching feedback.
    """
    try:
        analysis = MatchAnalysisService.compare_resume_to_job(
            resume_text=request.resume_text,
            job_description=request.job_description
        )
        return {"match": analysis}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error during match analysis: {str(e)}"
        )
