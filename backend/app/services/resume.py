from app.utils.pdf import PDFExtractor
from app.services.ai_analysis import AIAnalysisService

class ResumeService:
    @staticmethod
    def process_resume_pdf(pdf_bytes: bytes, filename: str) -> dict:
        """
        Coordinates the flow: PDF text extraction followed by AI resume review.
        """
        # 1. Parse PDF text
        text, page_count, word_count = PDFExtractor.extract_text_and_metadata(pdf_bytes)

        # 2. Run LLM review analysis on extracted text
        analysis = AIAnalysisService.analyze_resume_text(text)

        # 3. Return structured schema response
        return {
            "resume": {
                "filename": filename,
                "page_count": page_count,
                "word_count": word_count,
                "text": text
            },
            "analysis": analysis
        }
