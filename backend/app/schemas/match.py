from pydantic import BaseModel, Field
from typing import List, Optional

class JobMetadata(BaseModel):
    title: str = Field(description="Detected job title from the job description")
    company: Optional[str] = Field(None, description="Detected company name if present in the job description")
    experience_required: Optional[str] = Field(None, description="Experience requirements or seniority level (e.g. '3+ years', 'Senior')")
    employment_type: Optional[str] = Field(None, description="Type of employment (e.g. 'Full-time', 'Contract', 'Remote')")
    location: Optional[str] = Field(None, description="Location details if mentioned in the text (e.g. 'New York, NY', 'Remote')")

class MatchAnalysis(BaseModel):
    job_info: JobMetadata = Field(description="Structured metadata extracted from the target job description")
    match_score: int = Field(description="ATS match score from 0 to 100 assessing compatibility")
    score_explanation: str = Field(description="Short explanation of the match score, outlining the strongest matches and the largest gaps")
    compatibility_summary: str = Field(description="Overall compatibility summary between the resume and the job description")
    matching_skills: List[str] = Field(description="Skills that the candidate possesses that match the job requirements")
    critical_missing_skills: List[str] = Field(description="Crucial/mandatory skills required by the job description but missing from the resume")
    nicetohave_missing_skills: List[str] = Field(description="Nice-to-have or secondary skills from the job description that are missing from the resume")
    detected_keywords: List[str] = Field(description="Important industry-specific keywords from the job description present in the resume")
    missing_keywords: List[str] = Field(description="Important industry-specific keywords from the job description missing from the resume")
    experience_gaps: List[str] = Field(description="Gaps in experience, seniority, duration, or domain knowledge compared to requirements")
    education_fit: str = Field(description="Evaluation of the candidate's education level against the job requirements")
    strengths: List[str] = Field(description="Strengths of the candidate specifically in the context of this job")
    weaknesses: List[str] = Field(description="Weaknesses or areas where the candidate falls short for this job")
    priority_improvements: List[str] = Field(description="Highest priority improvements to align the resume with this job description")
    tailored_recommendations: List[str] = Field(description="Actionable, tailored recommendations for resume bullet points, summaries, or structure")

class MatchRequest(BaseModel):
    resume_text: str = Field(..., description="The raw extracted text of the candidate's resume")
    job_description: str = Field(..., description="The target job description text")

class MatchResponse(BaseModel):
    match: MatchAnalysis
