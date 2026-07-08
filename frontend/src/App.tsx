import { useEffect, useState } from 'react'
import { ResumeUpload } from '@/components/ResumeUpload'
import { JobMatchDashboard } from '@/components/JobMatchDashboard'
import { type ResumeUploadResponse } from '@/services/resume'
import { compareResumeToJob, type MatchAnalysis } from '@/services/match'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Cpu, 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  Shield,
  FileCheck,
  ChevronRight,
  Loader2,
  Trash2,
  CheckCircle2
} from 'lucide-react'

// Sample Job Description for testing
const SAMPLE_JOB_DESCRIPTION = `Software Engineer (Full-Stack)
Company: InnovateTech Corp
Location: Remote (US/Canada)
Employment Type: Full-Time
Experience: 3+ years

About the Role:
We are looking for a Software Engineer to join our core product team. You will build responsive user interfaces, design robust APIs, and maintain high-quality, testing-backed code.

Key Requirements:
- 3+ years of professional experience with React, TypeScript, and Tailwind CSS.
- Strong knowledge of backend technologies like Python, FastAPI, and PostgreSQL.
- Solid experience with Git, Docker, and AWS deployments.
- Understanding of software engineering best practices, code testing, and clean architecture.
- Degree in Computer Science, Engineering, or a related field.

Nice-to-Have:
- Experience with Google Cloud Platform (GCP) or Gemini API.
- Knowledge of GraphQL or Next.js.
- Strong technical writing and documentation skills.`;

type FlowStep = 'upload' | 'job_desc' | 'comparing' | 'dashboard'

function App() {
  const [step, setStep] = useState<FlowStep>('upload')
  const [uploadedResume, setUploadedResume] = useState<ResumeUploadResponse['resume'] | null>(null)
  
  // Job Description Inputs
  const [jobDescription, setJobDescription] = useState<string>('')
  const [charCount, setCharCount] = useState<number>(0)

  // Matching Analysis Result
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  // Loading Sequence State
  const [loaderStage, setLoaderStage] = useState<number>(1) // 1 to 7

  useEffect(() => {
    setCharCount(jobDescription.length)
  }, [jobDescription])

  const handleUploadStart = () => {
    setAnalysisError(null)
    setUploadedResume(null)
  }

  const handleUploadSuccess = (result: ResumeUploadResponse) => {
    setUploadedResume(result.resume)
    // Progress immediately to Step 2
    setStep('job_desc')
  }

  const handleUploadError = (error: string) => {
    setAnalysisError(error)
  }

  const handleReset = () => {
    setUploadedResume(null)
    setJobDescription('')
    setMatchAnalysis(null)
    setAnalysisError(null)
    setLoaderStage(1)
    setStep('upload')
  }

  // Orchestrate the simulated loading phases alongside the API call
  const handleRunMatchAnalysis = async () => {
    if (!uploadedResume) return
    if (!jobDescription.trim()) {
      setAnalysisError('Please paste a valid job description before analyzing.')
      return
    }

    setAnalysisError(null)
    setStep('comparing')
    setLoaderStage(3) // Stages 1 & 2 are complete (Resume uploaded & text extracted)

    // Timers to step through loading stages
    const stageTimers: any[] = []
    
    const incrementStage = (stageNum: number, delay: number) => {
      const timer = setTimeout(() => {
        setLoaderStage(stageNum)
      }, delay)
      stageTimers.push(timer)
    }

    // Schedule progressive stages
    incrementStage(4, 900)   // Technical skills comparison
    incrementStage(5, 1800)  // ATS compatibility calculation
    incrementStage(6, 2700)  // Recommendations generation
    incrementStage(7, 3600)  // Building report

    try {
      const response = await compareResumeToJob(uploadedResume.text, jobDescription)
      
      // Ensure we allow the animations to play through or proceed if they are done
      setTimeout(() => {
        setMatchAnalysis(response.match)
        setStep('dashboard')
      }, 4200)
    } catch (err: any) {
      stageTimers.forEach(clearTimeout)
      setAnalysisError(err.message || 'An error occurred during job matching analysis.')
      setStep('job_desc')
    }
  }

  const handlePasteSample = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION)
  }

  const handleClearJobDesc = () => {
    setJobDescription('')
  }

  const loadingStages = [
    { label: 'Resume Uploaded', stage: 1 },
    { label: 'Text Extracted', stage: 2 },
    { label: 'Understanding Job Requirements', stage: 3 },
    { label: 'Comparing Technical Skills', stage: 4 },
    { label: 'Calculating ATS Compatibility', stage: 5 },
    { label: 'Generating Recommendations', stage: 6 },
    { label: 'Building Report', stage: 7 }
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 flex flex-col items-center justify-start pb-16 relative overflow-hidden">
      
      {/* Glow Decorative Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none" />

      {/* Global SaaS Header */}
      <header className="w-full border-b border-neutral-900 bg-neutral-950/60 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 to-neutral-200 flex items-center gap-1.5 cursor-pointer" onClick={handleReset}>
              Nexume
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            </span>
          </div>

          {step !== 'upload' && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:text-white transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Analyze Another Resume
            </Button>
          )}
        </div>
      </header>

      {/* Centerpiece Layout Grid */}
      <main className="w-full max-w-3xl px-6 mt-12 flex flex-col gap-10 z-10 transition-all duration-500">
        
        {/* State 1: Upload Resume */}
        {step === 'upload' && (
          <div className="flex flex-col gap-10 animate-slide-up">
            <section className="flex flex-col items-center text-center gap-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by Gemini AI
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 via-neutral-100 to-neutral-350">
                AI Resume Analyzer & ATS Optimizer
              </h2>
              <p className="text-neutral-400 max-w-xl text-sm sm:text-base leading-relaxed">
                Upload your resume and receive AI-powered recruiter feedback, ATS scoring, missing skills analysis, and personalized recommendations in seconds.
              </p>
            </section>

            {/* Resume Upload Panel */}
            <section className="bg-neutral-900/20 border border-neutral-850 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl backdrop-blur-md">
              <ResumeUpload 
                onUploadStart={handleUploadStart}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                onReset={handleReset}
              />

              {analysisError && (
                <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-2.5 text-xs animate-fade-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{analysisError}</span>
                </div>
              )}
            </section>

            {/* Feature Highlights Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-neutral-900/10 border border-neutral-850 rounded-xl p-5 flex flex-col gap-3 group">
                <div className="p-2 w-fit rounded-lg bg-neutral-950 border border-neutral-850 text-purple-400 group-hover:border-purple-500/20 transition-all">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-neutral-200">Smart PDF Parsing</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  PyMuPDF extracts clean structured text from your resume.
                </p>
              </div>

              <div className="bg-neutral-900/10 border border-neutral-850 rounded-xl p-5 flex flex-col gap-3 group">
                <div className="p-2 w-fit rounded-lg bg-neutral-950 border border-neutral-850 text-purple-400 group-hover:border-purple-500/20 transition-all">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-neutral-200">AI Resume Review</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Gemini analyzes your resume like an experienced recruiter.
                </p>
              </div>

              <div className="bg-neutral-900/10 border border-neutral-850 rounded-xl p-5 flex flex-col gap-3 group">
                <div className="p-2 w-fit rounded-lg bg-neutral-950 border border-neutral-850 text-purple-400 group-hover:border-purple-500/20 transition-all">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-neutral-200">ATS Compatibility</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Receive an ATS score and identify missing keywords.
                </p>
              </div>

              <div className="bg-neutral-900/10 border border-neutral-850 rounded-xl p-5 flex flex-col gap-3 group">
                <div className="p-2 w-fit rounded-lg bg-neutral-950 border border-neutral-850 text-purple-400 group-hover:border-purple-500/20 transition-all">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-neutral-200">Actionable Recommendations</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Get practical improvements to increase interview chances.
                </p>
              </div>
            </section>

            <footer className="text-center text-[10px] text-neutral-600 border-t border-neutral-950 pt-8 flex items-center justify-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-neutral-700" />
              Your resume is processed securely and never stored permanently.
            </footer>
          </div>
        )}

        {/* State 2: Paste Job Description */}
        {step === 'job_desc' && uploadedResume && (
          <div className="flex flex-col gap-8 animate-slide-up">
            
            {/* Header detail */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-extrabold text-neutral-50 tracking-tight flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-purple-400" />
                Step 2: Paste Job Description
              </h2>
              <p className="text-neutral-400 text-sm">
                Nexume successfully parsed <span className="font-mono text-purple-300 font-semibold">{uploadedResume.filename}</span> ({uploadedResume.word_count} words). Provide the target job description to run the ATS compatibility optimization.
              </p>
            </div>

            {/* Input Form Card */}
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Job Description Description</label>
                <div className="flex gap-2">
                  <Button 
                    onClick={handlePasteSample}
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] text-purple-400 hover:text-purple-300 hover:bg-neutral-850"
                  >
                    Sample Job Description
                  </Button>
                  <Button 
                    onClick={handleClearJobDesc}
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] text-neutral-500 hover:text-neutral-350 hover:bg-neutral-850"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                  className="w-full min-h-[260px] bg-neutral-950/85 border border-neutral-850 focus:border-purple-500/40 rounded-xl p-4 text-xs font-normal text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all resize-y leading-relaxed font-sans"
                />
              </div>

              {/* Action and Stats bar */}
              <div className="flex items-center justify-between border-t border-neutral-850/80 pt-4">
                <span className="text-[10px] font-mono text-neutral-500">
                  {charCount.toLocaleString()} characters
                </span>
                
                <Button
                  onClick={handleRunMatchAnalysis}
                  disabled={!jobDescription.trim()}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 h-9 rounded-lg flex items-center gap-1.5 transition-all"
                >
                  Run Match Analysis
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {analysisError && (
              <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-2.5 text-xs animate-fade-in">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{analysisError}</span>
              </div>
            )}
          </div>
        )}

        {/* State 3: Comparing Progress Loader */}
        {step === 'comparing' && (
          <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center gap-8 shadow-xl animate-pulse-slow">
            
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-purple-500/10 bg-purple-500/5 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-center">
              <h3 className="text-lg font-bold text-neutral-50 tracking-tight">AI Matching In Progress</h3>
              <p className="text-xs text-neutral-450 max-w-xs leading-relaxed">
                Gemini is cross-referencing your experience and technical capabilities against the job requirements...
              </p>
            </div>

            {/* Stages Checklists */}
            <div className="w-full max-w-xs flex flex-col gap-3.5 border-t border-neutral-850 pt-6">
              {loadingStages.map((stageItem) => {
                const isDone = loaderStage > stageItem.stage;
                const isActive = loaderStage === stageItem.stage;
                return (
                  <div key={stageItem.stage} className="flex items-center justify-between text-xs transition-all duration-300">
                    <span className={`font-medium ${isDone ? 'text-neutral-400' : isActive ? 'text-purple-400 font-bold' : 'text-neutral-600'}`}>
                      {stageItem.label}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 mr-1 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* State 4: Match Dashboard */}
        {step === 'dashboard' && matchAnalysis && uploadedResume && (
          <div className="animate-fade-in">
            <JobMatchDashboard 
              filename={uploadedResume.filename}
              analysis={matchAnalysis}
              resumeText={uploadedResume.text}
            />
          </div>
        )}

      </main>
    </div>
  )
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export default App
