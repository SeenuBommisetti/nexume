from app.services.gemini_client import GeminiClient
from app.schemas.match import MatchAnalysis
from app.prompts.match_analysis import SYSTEM_INSTRUCTION

class MatchAnalysisService:
    @staticmethod
    def compare_resume_to_job(resume_text: str, job_description: str) -> MatchAnalysis:
        """
        Compares the candidate's resume text against a target job description.
        Validates both input texts, formats the comparison query, and calls
        the generic Gemini structured client to generate the matching report.
        """
        if not resume_text or not resume_text.strip():
            raise ValueError("Extracted resume text is empty. Cannot perform job match analysis.")

        if not job_description or not job_description.strip():
            raise ValueError("Job description text is empty. Please provide a valid job description.")

        # Construct comparison prompt
        prompt = f"Candidate Resume Text:\n{resume_text.strip()}\n\nTarget Job Description:\n{job_description.strip()}"

        # Call the generic Gemini client
        analysis = GeminiClient.generate_structured_data(
            prompt=prompt,
            system_instruction=SYSTEM_INSTRUCTION,
            response_schema=MatchAnalysis
        )

        return analysis
