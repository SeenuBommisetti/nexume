from app.utils.pdf import PDFExtractor

class ResumeService:
    @staticmethod
    def process_resume_pdf(pdf_bytes: bytes, filename: str) -> dict:
        """
        Coordinates the parsing of resume PDF bytes, extracting text and metadata.
        """
        text, page_count, word_count = PDFExtractor.extract_text_and_metadata(pdf_bytes)
        return {
            "resume": {
                "filename": filename,
                "file_size": len(pdf_bytes),
                "page_count": page_count,
                "word_count": word_count,
                "text": text
            }
        }
