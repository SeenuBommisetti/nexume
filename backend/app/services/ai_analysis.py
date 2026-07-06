from app.services.gemini_client import GeminiClient
from app.schemas.analysis import ResumeAnalysis
from app.prompts.resume_analysis import SYSTEM_INSTRUCTION

class AIAnalysisService:
    @staticmethod
    def analyze_resume_text(text: str) -> ResumeAnalysis:
        """
        Validates the text, builds the resume-specific prompt, and
        passes it to the generic Gemini Client for structured feedback.
        """
        if not text or not text.strip():
            raise ValueError("Extracted resume text is empty. Cannot perform AI analysis.")

        prompt = f"Please analyze the following resume text:\n\n{text}"

        # Call the generic Gemini client with our specific prompt, system instructions, and schema
        analysis = GeminiClient.generate_structured_data(
            prompt=prompt,
            system_instruction=SYSTEM_INSTRUCTION,
            response_schema=ResumeAnalysis
        )

        # Cast to type-safe schema
        return analysis
