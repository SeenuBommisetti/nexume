import { useState } from 'react'
import { type ResumeDetail, type ResumeAnalysis } from '@/services/resume'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  Eye, 
  EyeOff, 
  FileText, 
  Cpu, 
  RotateCcw,
  Sparkles
} from 'lucide-react'

interface ResumeAnalysisDashboardProps {
  resume: ResumeDetail
  analysis: ResumeAnalysis
  onReset: () => void
}

export function ResumeAnalysisDashboard({ resume, analysis, onReset }: ResumeAnalysisDashboardProps) {
  const [showDebugText, setShowDebugText] = useState(false)
  const score = analysis.overall_score

  // Determine color theme based on score threshold
  const getScoreTheme = (val: number) => {
    if (val >= 80) return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
      stroke: 'stroke-emerald-400'
    }
    if (val >= 50) return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
      stroke: 'stroke-amber-400'
    }
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      glow: 'shadow-rose-500/10',
      stroke: 'stroke-rose-400'
    }
  }

  const theme = getScoreTheme(score)

  // SVG Radial parameters
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in">
      
      {/* Overview Dashboard Banner */}
      <section className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow behind score dial */}
        <div className={`absolute top-0 left-0 w-48 h-48 rounded-full ${theme.bg} blur-[60px] pointer-events-none`} />

        {/* Score Dial Wrapper */}
        <div className="flex flex-col items-center justify-center shrink-0 gap-3 z-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-neutral-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Foreground Animated Progress Circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className={`${theme.stroke} transition-all duration-1000 ease-out`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold tracking-tight text-neutral-50">{score}</span>
              <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">ATS SCORE</span>
            </div>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${theme.border} ${theme.bg} ${theme.text} text-xs font-semibold`}>
            {score >= 80 ? 'Highly Compatible' : score >= 50 ? 'Needs Improvement' : 'Low Compatibility'}
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="flex flex-col justify-between gap-4 w-full z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-semibold tracking-wider uppercase">PROFILE REVIEW SUMMARY</span>
              <span className="text-xs font-mono text-neutral-400 truncate max-w-[220px]" title={resume.filename}>
                {resume.filename}
              </span>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed text-justify">
              {analysis.summary || 'Summary could not be generated.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/80 pt-4">
            <div className="flex gap-4 text-xs text-neutral-400 font-mono">
              <div><span className="text-neutral-500">pages:</span> {resume.page_count}</div>
              <div><span className="text-neutral-500">words:</span> {resume.word_count}</div>
            </div>
            
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-neutral-800 bg-neutral-950/20 hover:bg-neutral-850 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Upload New
            </Button>
          </div>
        </div>
      </section>

      {/* Grid of Strengths & Weaknesses */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths Card */}
        <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 border-b border-neutral-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Key Strengths
          </h3>
          <ul className="flex flex-col gap-3">
            {analysis.strengths && analysis.strengths.length > 0 ? (
              analysis.strengths.map((str, i) => (
                <li key={i} className="flex gap-2.5 items-start text-xs text-neutral-300 leading-relaxed">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-neutral-500 italic">No notable strengths identified.</li>
            )}
          </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 border-b border-neutral-800 pb-3">
            <XCircle className="w-4 h-4 text-rose-500" />
            Areas of Concern
          </h3>
          <ul className="flex flex-col gap-3">
            {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
              analysis.weaknesses.map((weak, i) => (
                <li key={i} className="flex gap-2.5 items-start text-xs text-neutral-300 leading-relaxed">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                  <span>{weak}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-neutral-500 italic">No notable areas of concern identified.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Missing Skills Section */}
      <section className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
        <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Cpu className="w-4 h-4 text-purple-400" />
          Recommended Skills to Add
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {analysis.missing_skills && analysis.missing_skills.length > 0 ? (
            analysis.missing_skills.map((skill, i) => (
              <span 
                key={i} 
                className="px-3 py-1 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs font-semibold text-purple-300 hover:border-purple-500/20 transition-all cursor-default"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-neutral-500 italic">All expected industry skills are well represented.</span>
          )}
        </div>
      </section>

      {/* Actionable Recommendations Section */}
      <section className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
        <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Actionable Resume Enhancements
        </h3>
        <ul className="flex flex-col gap-3.5">
          {analysis.recommendations && analysis.recommendations.length > 0 ? (
            analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 items-start text-xs text-neutral-300 leading-relaxed bg-neutral-950/20 p-3 rounded-xl border border-neutral-850">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))
          ) : (
            <li className="text-xs text-neutral-500 italic">No specific recommendations needed.</li>
          )}
        </ul>
      </section>

      {/* Accordion Collapsible Raw Text Debug Area */}
      <section className="bg-neutral-900/10 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold">Raw Extracted Text (PyMuPDF Debug)</span>
          </div>
          <Button
            onClick={() => setShowDebugText(!showDebugText)}
            variant="ghost"
            size="sm"
            className="h-8 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-850 text-[11px] px-2.5"
          >
            {showDebugText ? (
              <>
                <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                Hide Debug
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Show Debug
              </>
            )}
          </Button>
        </div>

        {showDebugText && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-950/40 border border-neutral-850 text-neutral-400 text-[10px] font-mono leading-normal">
              <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>This panel displays the raw text extraction output generated before sending it to the AI Analysis Service.</span>
            </div>
            <div className="w-full max-h-[220px] overflow-y-auto bg-neutral-950 rounded-xl border border-neutral-850 p-4 font-mono text-[11px] text-neutral-400 leading-relaxed">
              <pre className="whitespace-pre-wrap break-words">{resume.text}</pre>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
