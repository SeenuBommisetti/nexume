from pydantic import BaseModel

class ResumeDetail(BaseModel):
    filename: str
    file_size: int
    page_count: int
    word_count: int
    text: str

class ResumeUploadResponse(BaseModel):
    resume: ResumeDetail
