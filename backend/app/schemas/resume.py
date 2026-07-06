from pydantic import BaseModel
from app.schemas.analysis import ResumeAnalysis

class ResumeDetail(BaseModel):
    filename: str
    page_count: int
    word_count: int
    text: str

class ResumeUploadResponse(BaseModel):
    resume: ResumeDetail
    analysis: ResumeAnalysis
