const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface JobMetadata {
  title: string;
  company?: string;
  experience_required?: string;
  employment_type?: string;
  location?: string;
}

export interface MatchAnalysis {
  job_info: JobMetadata;
  match_score: number;
  score_explanation: string;
  compatibility_summary: string;
  matching_skills: string[];
  critical_missing_skills: string[];
  nicetohave_missing_skills: string[];
  detected_keywords: string[];
  missing_keywords: string[];
  experience_gaps: string[];
  education_fit: string;
  strengths: string[];
  weaknesses: string[];
  priority_improvements: string[];
  tailored_recommendations: string[];
}

export interface MatchResponse {
  match: MatchAnalysis;
}

export async function compareResumeToJob(
  resumeText: string,
  jobDescription: string
): Promise<MatchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/match/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    let errorMessage = `Failed to process match: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<MatchResponse>;
}
