import { useEffect, useState } from 'react'
import { checkBackendHealth, type HealthResponse } from '@/services/api'
import { Button } from '@/components/ui/button'
import { ResumeUpload } from '@/components/ResumeUpload'
import { type ResumeDetail } from '@/services/resume'
import { 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Sparkles, 
  Terminal, 
  FileText, 
  Cpu, 
  Eye, 
  EyeOff, 
  Layers, 
  Info 
} from 'lucide-react'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true)
  const [healthError, setHealthError] = useState<string | null>(null)

  // Upload integration states
  const [parsedResume, setParsedResume] = useState<ResumeDetail | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showDebugPreview, setShowDebugPreview] = useState<boolean>(true)

  const verifyHealth = async () => {
    setLoadingHealth(true)
    setHealthError(null)
    try {
      const data = await checkBackendHealth()
      setHealth(data)
    } catch (err: any) {
      setHealthError(err.message || 'Failed to connect to backend')
      setHealth(null)
    } finally {
      setLoadingHealth(false)
    }
  }

  useEffect(() => {
    verifyHealth()
  }, [])

  const handleUploadStart = () => {
    setUploadError(null)
    setParsedResume(null)
  }

  const handleUploadSuccess = (resume: ResumeDetail) => {
    setParsedResume(resume)
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
  }

  const handleReset = () => {
    setParsedResume(null)
    setUploadError(null)
  }

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 flex flex-col items-center justify-start py-12 px-6 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-3xl flex flex-col gap-8 z-10">
        
        {/* Header */}
        <header className="flex flex-col items-center text-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            AI Resume Analyzer & ATS Optimizer
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 via-neutral-200 to-purple-400">
            Nexume
          </h1>
          <p className="text-neutral-400 max-w-md text-sm sm:text-base">
            Upload your resume, parse structural text using PyMuPDF, and verify API data pipeline integration.
          </p>
        </header>

        {/* Integration Status Banner */}
        <section className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-neutral-300">
              <Terminal className="w-4 h-4 text-purple-400" />
              API Server Status
            </h2>
            <Button
              onClick={verifyHealth}
              disabled={loadingHealth}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs border-neutral-800 bg-neutral-950/40 hover:bg-neutral-800 hover:text-white"
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 ${loadingHealth ? 'animate-spin' : ''}`} />
              Re-check
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-950/40 rounded-xl p-3 border border-neutral-850 flex flex-col gap-1">
              <span className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Connection</span>
              {loadingHealth ? (
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-medium">Checking...</span>
                </div>
              ) : healthError ? (
                <div className="flex items-center gap-1.5 text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Offline</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Online</span>
                </div>
              )}
            </div>

            <div className="bg-neutral-950/40 rounded-xl p-3 border border-neutral-850 flex flex-col gap-1">
              <span className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">Active Instance</span>
              {loadingHealth ? (
                <span className="text-xs text-neutral-500 font-mono">Querying...</span>
              ) : health ? (
                <span className="text-xs text-neutral-300 font-mono">
                  {health.service} (v{health.version})
                </span>
              ) : (
                <span className="text-xs text-rose-400 font-mono">Unreachable</span>
              )}
            </div>
          </div>
        </section>

        {/* Upload Container */}
        <main className="flex flex-col gap-6">
          <section className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-neutral-200">Resume File Upload</h2>
              <p className="text-xs text-neutral-500">Upload your PDF resume to extract its text contents.</p>
            </div>

            <ResumeUpload 
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              onReset={handleReset}
            />

            {uploadError && (
              <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{uploadError}</span>
              </div>
            )}
          </section>

          {/* TEMPORARY DEBUG EXTRACTION PREVIEW VIEW */}
          {parsedResume && (
            <section className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-purple-500/10 text-purple-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-neutral-200">PyMuPDF Debug Text View</h2>
                </div>
                
                <Button
                  onClick={() => setShowDebugPreview(!showDebugPreview)}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 text-xs px-2.5"
                >
                  {showDebugPreview ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                      Hide Text
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Show Text
                    </>
                  )}
                </Button>
              </div>

              {/* Metadata Indicators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-850 flex flex-col gap-0.5">
                  <span className="text-[10px] text-neutral-500 font-medium">FILE NAME</span>
                  <span className="text-xs font-semibold text-neutral-200 truncate" title={parsedResume.filename}>
                    {parsedResume.filename}
                  </span>
                </div>
                <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-850 flex flex-col gap-0.5">
                  <span className="text-[10px] text-neutral-500 font-medium">FILE SIZE</span>
                  <span className="text-xs font-semibold text-neutral-200">
                    {formatBytes(parsedResume.file_size)}
                  </span>
                </div>
                <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-850 flex flex-col gap-0.5">
                  <span className="text-[10px] text-neutral-500 font-medium">PAGES</span>
                  <span className="text-xs font-semibold text-neutral-200">
                    {parsedResume.page_count} page{parsedResume.page_count > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-850 flex flex-col gap-0.5">
                  <span className="text-[10px] text-neutral-500 font-medium">EST. WORD COUNT</span>
                  <span className="text-xs font-semibold text-neutral-200">
                    {parsedResume.word_count} words
                  </span>
                </div>
              </div>

              {/* Scrollable Text Box */}
              {showDebugPreview && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950/40 border border-neutral-850 text-neutral-400 text-[10px] font-mono leading-relaxed">
                    <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>This debug window acts as a temporary visualization layer and will be swapped with the AI analysis dashboard in Step 3.</span>
                  </div>
                  
                  <div className="w-full max-h-[350px] overflow-y-auto bg-neutral-950 rounded-xl border border-neutral-850 p-4 font-mono text-xs text-neutral-300 leading-relaxed scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                    {parsedResume.text.trim() ? (
                      <pre className="whitespace-pre-wrap break-words selection:bg-purple-500/40">
                        {parsedResume.text}
                      </pre>
                    ) : (
                      <span className="italic text-neutral-600">No readable text found in PDF layout stream.</span>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Core Clean Architecture Indicators */}
          {!parsedResume && (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl p-5 flex flex-col gap-3">
                <div className="p-2 w-fit rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-neutral-200">PDFParser (PyMuPDF)</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Processes and validates PDF structures inside a dedicated utility package without polluting services or routes.
                </p>
              </div>

              <div className="bg-neutral-900/20 border border-neutral-850 rounded-xl p-5 flex flex-col gap-3">
                <div className="p-2 w-fit rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-neutral-200">Isolate AI Pipeline</h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Decoupled layers preserve separation between extraction parsing logic and Gemini processing structures.
                </p>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-[11px] text-neutral-600 border-t border-neutral-900 pt-6">
          Nexume Architecture Stack: React, Vite, TS, Tailwind CSS v4, shadcn/ui & FastAPI, Pydantic
        </footer>
      </div>
    </div>
  )
}

export default App
