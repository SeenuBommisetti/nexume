from pydantic import BaseModel, Field
from typing import List

class ResumeAnalysis(BaseModel):
    overall_score: int = Field(description="Estimated ATS compatibility score from 0 to 100")
    summary: str = Field(description="Professional profile summary evaluation of the candidate")
    strengths: List[str] = Field(description="Identified professional and formatting strengths in the resume")
    weaknesses: List[str] = Field(description="Identified gaps, writing issues, or structural weaknesses in the resume")
    missing_skills: List[str] = Field(description="Critical industry-standard skills that are missing or underrepresented")
    recommendations: List[str] = Field(description="Concrete and actionable suggestions to improve the resume compatibility score")
