import { useState } from 'react'
import { ResumeUpload } from '@/components/ResumeUpload'
import { ResumeAnalysisDashboard } from '@/components/ResumeAnalysisDashboard'
import { type ResumeUploadResponse } from '@/services/resume'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Cpu, 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  Shield 
} from 'lucide-react'

function App() {
  // Upload integration states
  const [uploadResult, setUploadResult] = useState<ResumeUploadResponse | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleUploadStart = () => {
    setUploadError(null)
    setUploadResult(null)
  }

  const handleUploadSuccess = (result: ResumeUploadResponse) => {
    setUploadResult(result)
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
  }

  const handleReset = () => {
    setUploadResult(null)
    setUploadError(null)
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 flex flex-col items-center justify-start pb-16 relative overflow-hidden">
      
      {/* Decorative Glow Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="w-full border-b border-neutral-900 bg-neutral-950/60 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 to-neutral-200 flex items-center gap-1.5">
              Nexume
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            </span>
          </div>

          {uploadResult && (
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

      {/* Main Content Area */}
      <main className="w-full max-w-3xl px-6 mt-12 flex flex-col gap-10 z-10 transition-all duration-500">
        
        {/* Landing Page Content (Hero + Upload + Features + Footer) */}
        {!uploadResult && (
          <div className="flex flex-col gap-10 animate-slide-up">
            
            {/* SaaS Hero Section */}
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

            {/* Upload Box Card */}
            <section className="bg-neutral-900/20 border border-neutral-850 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl backdrop-blur-md">
              <ResumeUpload 
                onUploadStart={handleUploadStart}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                onReset={handleReset}
              />

              {uploadError && (
                <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-2.5 text-xs animate-fade-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{uploadError}</span>
                </div>
              )}
            </section>

            {/* Premium SaaS Feature Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-neutral-900/10 hover:bg-neutral-900/30 border border-neutral-850 hover:border-neutral-800 rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                <div className="p-2 w-fit rounded-lg bg-neutral-950 border border-neutral-850 text-purple-400 group-hover:border-purple-500/20 transition-all">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-neutral-200">Smart PDF Parsing</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  PyMuPDF extracts clean structured text from your resume.
                </p>
              </div>

              <div className="bg-neutral-900/10 hover:bg-neutral-900/30 border border-neutral-850 hover:border-neutral-800 rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                <div className="p-2 w-fit rounded-lg bg-neutral-950 border border-neutral-850 text-purple-400 group-hover:border-purple-500/20 transition-all">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-neutral-200">AI Resume Review</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Gemini analyzes your resume like an experienced recruiter.
                </p>
              </div>

              <div className="bg-neutral-900/10 hover:bg-neutral-900/30 border border-neutral-850 hover:border-neutral-800 rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                <div className="p-2 w-fit rounded-lg bg-neutral-950 border border-neutral-850 text-purple-400 group-hover:border-purple-500/20 transition-all">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-neutral-200">ATS Compatibility</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Receive an ATS score and identify missing keywords.
                </p>
              </div>

              <div className="bg-neutral-900/10 hover:bg-neutral-900/30 border border-neutral-850 hover:border-neutral-800 rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                <div className="p-2 w-fit rounded-lg bg-neutral-950 border border-neutral-850 text-purple-400 group-hover:border-purple-500/20 transition-all">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-neutral-200">Actionable Recommendations</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Get practical improvements to increase interview chances.
                </p>
              </div>

            </section>

            {/* Secure processing Footer */}
            <footer className="text-center text-[10px] text-neutral-600 border-t border-neutral-950 pt-8 flex items-center justify-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-neutral-700" />
              Your resume is processed securely and never stored permanently.
            </footer>

          </div>
        )}

        {/* Dashboard Results (Hides landing page blocks on success) */}
        {uploadResult && (
          <div className="animate-fade-in">
            <ResumeAnalysisDashboard 
              resume={uploadResult.resume}
              analysis={uploadResult.analysis}
            />
          </div>
        )}

      </main>
    </div>
  )
}

// AlertCircle local definition or import
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
