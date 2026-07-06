from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.resume import ResumeUploadResponse
from app.services.resume import ResumeService

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    # Validate extension and content type
    is_pdf_ext = file.filename.lower().endswith(".pdf")
    is_pdf_mime = file.content_type == "application/pdf"

    if not (is_pdf_ext or is_pdf_mime):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF documents are accepted."
        )

    # Read file content into memory
    contents = await file.read()
    file_size = len(contents)

    # Validate file size (10 MB limit)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of 10 MB. Uploaded size: {file_size / (1024 * 1024):.2f} MB."
        )

    try:
        # Process and extract content
        parsed_resume = ResumeService.process_resume_pdf(contents, file.filename)
        return parsed_resume
    except ValueError as e:
        # PyMuPDF failed to parse (invalid PDF structure)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error occurred during extraction: {str(e)}"
        )
