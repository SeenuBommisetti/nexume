import fitz

class PDFExtractor:
    @staticmethod
    def extract_text_and_metadata(pdf_bytes: bytes) -> tuple[str, int, int]:
        """
        Attempts to parse the PDF bytes using PyMuPDF.
        Raises ValueError if the PDF is invalid or corrupt.
        Returns a tuple of (extracted_text, page_count, word_count)
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as e:
            raise ValueError(f"Invalid PDF file structure: {str(e)}")

        try:
            text = ""
            for page in doc:
                text += page.get_text()

            page_count = doc.page_count
            doc.close()

            # Word count by splitting by whitespace
            word_count = len(text.split())

            return text, page_count, word_count
        except Exception as e:
            if 'doc' in locals() and not doc.is_closed:
                doc.close()
            raise ValueError(f"Failed to extract content: {str(e)}")
