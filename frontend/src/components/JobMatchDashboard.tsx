import { useState } from 'react'
import { type MatchAnalysis } from '@/services/match'
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
  Briefcase, 
  Building, 
  MapPin, 
  Clock, 
  Sparkles,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react'

interface JobMatchDashboardProps {
  filename: string
  analysis: MatchAnalysis
  resumeText: string
}

export function JobMatchDashboard({ filename, analysis, resumeText }: JobMatchDashboardProps) {
  const [showRawText, setShowRawText] = useState(false)
  const score = analysis.match_score
  const info = analysis.job_info

  // Determine color theme based on match score threshold
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

  // SVG circular dial parameters
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in">
      
      {/* 1. Job Information Banner */}
      <section className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-purple-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Target Role Match Analysis
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-50 tracking-tight">
            {info.title}
          </h2>
          {info.company && (
            <p className="text-neutral-400 text-sm font-medium flex items-center gap-1.5 mt-0.5">
              <Building className="w-4 h-4 text-neutral-500" />
              {info.company}
            </p>
          )}
        </div>

        {/* Structured Job Meta Chips */}
        <div className="flex flex-wrap gap-3 border-t border-neutral-850 pt-4 text-xs">
          {info.experience_required && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950/60 border border-neutral-850 text-neutral-300 font-mono">
              <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
              {info.experience_required}
            </span>
          )}
          {info.employment_type && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950/60 border border-neutral-850 text-neutral-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              {info.employment_type}
            </span>
          )}
          {info.location && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950/60 border border-neutral-850 text-neutral-300 font-mono">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              {info.location}
            </span>
          )}
        </div>
      </section>

      {/* 2. Score Meter and Score Explanation */}
      <section className="bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Glow */}
        <div className={`absolute top-0 left-0 w-48 h-48 rounded-full ${theme.bg} blur-[65px] pointer-events-none`} />

        {/* Circular Progress Score Dial */}
        <div className="flex flex-col items-center justify-center shrink-0 gap-3 z-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-neutral-800"
                strokeWidth="8"
                fill="transparent"
              />
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
              <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">MATCH SCORE</span>
            </div>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${theme.border} ${theme.bg} ${theme.text} text-xs font-semibold`}>
            {score >= 80 ? 'Excellent Match' : score >= 50 ? 'Moderate Match' : 'Weak Alignment'}
          </div>
        </div>

        {/* Score Explanation Summary */}
        <div className="flex flex-col justify-center gap-4 w-full z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-bold tracking-wider uppercase flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
                Score Explanation
              </span>
              <span className="text-xs font-mono text-neutral-400 truncate max-w-[200px]" title={filename}>
                {filename}
              </span>
            </div>
            <p className="text-sm text-neutral-200 font-medium leading-relaxed">
              {analysis.score_explanation}
            </p>
            <p className="text-xs text-neutral-450 leading-relaxed mt-1 text-justify">
              {analysis.compatibility_summary}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Skills Coverage Grid (Matching vs Split Missing Skills) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Matching Skills */}
        <div className="bg-neutral-900/15 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2 border-b border-neutral-850 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            Matching Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {analysis.matching_skills && analysis.matching_skills.length > 0 ? (
              analysis.matching_skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-semibold text-emerald-400 font-mono">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500 italic">No matching skills identified.</span>
            )}
          </div>
        </div>

        {/* Critical Missing Skills */}
        <div className="bg-neutral-900/15 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <h3 className="text-xs font-bold text-rose-400 flex items-center gap-2 border-b border-neutral-850 pb-3">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            Critical Missing Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {analysis.critical_missing_skills && analysis.critical_missing_skills.length > 0 ? (
              analysis.critical_missing_skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-rose-500/5 border border-rose-500/10 text-[10px] font-semibold text-rose-450 font-mono">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500 italic">No critical missing skills.</span>
            )}
          </div>
        </div>

        {/* Nice-to-Have Missing Skills */}
        <div className="bg-neutral-900/15 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <h3 className="text-xs font-bold text-neutral-300 flex items-center gap-2 border-b border-neutral-850 pb-3">
            <Info className="w-4 h-4 text-neutral-400 shrink-0" />
            Nice-to-Have Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {analysis.nicetohave_missing_skills && analysis.nicetohave_missing_skills.length > 0 ? (
              analysis.nicetohave_missing_skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-850 text-[10px] font-semibold text-neutral-400 font-mono">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500 italic">No nice-to-have missing skills.</span>
            )}
          </div>
        </div>

      </section>

      {/* 4. Keyword Coverage (Detected vs Missing) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Detected Keywords */}
        <div className="bg-neutral-900/15 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <h3 className="text-xs font-bold text-neutral-300 flex items-center gap-2 border-b border-neutral-850 pb-3">
            <CheckCircle2 className="w-4 h-4 text-neutral-500 shrink-0" />
            Detected Keywords
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {analysis.detected_keywords && analysis.detected_keywords.length > 0 ? (
              analysis.detected_keywords.map((word, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-medium text-neutral-300">
                  {word}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500 italic">No keywords detected.</span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-neutral-900/15 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2 border-b border-neutral-850 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missing_keywords && analysis.missing_keywords.length > 0 ? (
              analysis.missing_keywords.map((word, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-amber-500/5 border border-amber-500/10 text-[10px] font-semibold text-amber-400">
                  {word}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-500 italic">No missing keywords.</span>
            )}
          </div>
        </div>
      </section>

      {/* 5. Experience & Education Fit */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Experience fit and Gaps */}
        <div className="bg-neutral-900/15 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
          <h3 className="text-xs font-bold text-neutral-200 flex items-center gap-2 border-b border-neutral-850 pb-3">
            <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />
            Experience Fit & Gaps
          </h3>
          <ul className="flex flex-col gap-3">
            {analysis.experience_gaps && analysis.experience_gaps.length > 0 ? (
              analysis.experience_gaps.map((gap, i) => (
                <li key={i} className="flex gap-2.5 items-start text-xs text-neutral-350 leading-relaxed">
                  <ArrowRight className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                  <span>{gap}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-neutral-500 italic">No experience gaps noted.</li>
            )}
          </ul>
        </div>

        {/* Education Fit */}
        <div className="bg-neutral-900/15 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg justify-start">
          <h3 className="text-xs font-bold text-neutral-200 flex items-center gap-2 border-b border-neutral-850 pb-3">
            <Award className="w-4 h-4 text-purple-400 shrink-0" />
            Education Alignment
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed leading-normal bg-neutral-950/40 p-4 rounded-xl border border-neutral-850">
            {analysis.education_fit || 'Education requirements not detailed.'}
          </p>
        </div>
      </section>

      {/* 6. Actionable Improvements & Recommendations */}
      <section className="bg-neutral-900/15 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-5 shadow-lg">
        <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2 border-b border-neutral-800 pb-3.5">
          <Sparkles className="w-4.5 h-4.5 text-purple-400 shrink-0" />
          ATS Matching Optimization Plan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority Improvements */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-neutral-550 font-bold uppercase tracking-wider">Priority Improvements</span>
            <ul className="flex flex-col gap-3">
              {analysis.priority_improvements && analysis.priority_improvements.length > 0 ? (
                analysis.priority_improvements.map((imp, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-xs text-neutral-350 leading-relaxed">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[9px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{imp}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-neutral-500 italic">No adjustments needed.</li>
              )}
            </ul>
          </div>

          {/* Tailored Recommendations */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-neutral-550 font-bold uppercase tracking-wider">Tailored Recommendations</span>
            <ul className="flex flex-col gap-3">
              {analysis.tailored_recommendations && analysis.tailored_recommendations.length > 0 ? (
                analysis.tailored_recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-xs text-neutral-350 leading-relaxed bg-neutral-950/20 p-3 rounded-lg border border-neutral-850">
                    <ArrowRight className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-neutral-500 italic">No recommendations.</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Collapsible Raw Resume Text */}
      <section className="bg-neutral-900/10 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold">Extracted Resume Text</span>
          </div>
          <Button
            onClick={() => setShowRawText(!showRawText)}
            variant="ghost"
            size="sm"
            className="h-8 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-850 text-[11px] px-2.5"
          >
            {showRawText ? (
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

        {showRawText && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div className="w-full max-h-[220px] overflow-y-auto bg-neutral-950 rounded-xl border border-neutral-850 p-4 font-mono text-[11px] text-neutral-400 leading-relaxed">
              <pre className="whitespace-pre-wrap break-words">{resumeText}</pre>
            </div>
          </div>
        )}
      </section>

    </div>
  )
}
