import { useEffect, useState } from 'react'
import { checkBackendHealth, type HealthResponse } from '@/services/api'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, RefreshCw, Sparkles, Terminal, FileText, Cpu } from 'lucide-react'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const verifyHealth = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await checkBackendHealth()
      setHealth(data)
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend')
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyHealth()
  }, [])

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Main Content Container */}
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
            Evaluate your resume against job descriptions using advanced AI, optimize ATS parsing compatibility, and land more interviews.
          </p>
        </header>

        {/* Integration Status Section */}
        <main className="flex flex-col gap-6">
          <section className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                System Integration
              </h2>
              
              <Button
                onClick={verifyHealth}
                disabled={loading}
                variant="outline"
                size="sm"
                className="h-9 px-3 border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:text-white transition-all duration-200"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Check Status
              </Button>
            </div>

            {/* Status Display Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-950/50 rounded-xl p-4 border border-neutral-800/60 flex flex-col gap-2">
                <span className="text-xs text-neutral-500 font-medium">BACKEND CONNECTIVITY</span>
                
                {loading ? (
                  <div className="flex items-center gap-2 text-neutral-400 py-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-semibold text-sm">Connecting to API...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 text-rose-400 py-1">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className="font-semibold text-sm">Disconnected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 py-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-sm">Connected</span>
                  </div>
                )}
              </div>

              <div className="bg-neutral-950/50 rounded-xl p-4 border border-neutral-800/60 flex flex-col gap-2">
                <span className="text-xs text-neutral-500 font-medium">HEALTH DATA</span>
                {loading ? (
                  <span className="text-sm text-neutral-400 py-1">Querying endpoint...</span>
                ) : error ? (
                  <span className="text-xs text-rose-400/90 font-mono py-1 break-all line-clamp-1">
                    {error}
                  </span>
                ) : health ? (
                  <div className="flex flex-col text-xs font-mono text-neutral-400 gap-0.5">
                    <div><span className="text-neutral-500">service:</span> {health.service}</div>
                    <div><span className="text-neutral-500">version:</span> {health.version}</div>
                    <div><span className="text-neutral-500">status:</span> {health.status}</div>
                  </div>
                ) : (
                  <span className="text-sm text-neutral-500 py-1">No data available</span>
                )}
              </div>
            </div>
          </section>

          {/* Clean Architecture Preview Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-xl p-5 flex flex-col gap-3 hover:border-neutral-700/60 transition-all duration-300">
              <div className="p-2 w-fit rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-neutral-200">PDF Parsing Service</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Boilerplate PyMuPDF setup ready for extracting structured text, layout components, and sections from resume documents.
              </p>
            </div>

            <div className="bg-neutral-900/20 border border-neutral-800/80 rounded-xl p-5 flex flex-col gap-3 hover:border-neutral-700/60 transition-all duration-300">
              <div className="p-2 w-fit rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-neutral-200">Google GenAI Integration</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                FastAPI service layer configured with google-genai SDK for deep semantic resume analysis and matching score.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-neutral-600 border-t border-neutral-900 pt-6">
          Nexume Architecture Stack: React, Vite, TS, Tailwind CSS v4, shadcn/ui & FastAPI, Pydantic
        </footer>
      </div>
    </div>
  )
}

export default App
