import React, { useState, useRef } from 'react'
import { uploadResume } from '@/services/resume'
import { UploadCloud, FileText, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResumeUploadProps {
  onUploadSuccess: (resume: any) => void;
  onUploadStart: () => void;
  onUploadError: (error: string) => void;
  onReset: () => void;
}

export function ResumeUpload({ onUploadSuccess, onUploadStart, onUploadError, onReset }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'extracting' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const validateAndUpload = async (file: File) => {
    // Client-side MIME / extension validation
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPDF) {
      handleLocalError('Invalid file type. Only PDF documents are accepted.')
      return
    }

    // Client-side File size validation (10 MB)
    if (file.size > MAX_FILE_SIZE) {
      handleLocalError('File is too large. Maximum allowed size is 10 MB.')
      return
    }

    setErrorMessage(null)
    setUploadedFileName(file.name)
    setStatus('uploading')
    setProgress(0)
    onUploadStart()

    try {
      const result = await uploadResume(file, (percent) => {
        setProgress(percent)
        if (percent === 100) {
          setStatus('extracting')
        }
      })
      setStatus('idle')
      onUploadSuccess(result.resume)
    } catch (err: any) {
      handleLocalError(err.message || 'An unexpected error occurred during upload.')
    }
  }

  const handleLocalError = (msg: string) => {
    setErrorMessage(msg)
    setStatus('error')
    onUploadError(msg)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0])
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const resetUploader = () => {
    setStatus('idle')
    setErrorMessage(null)
    setUploadedFileName(null)
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onReset()
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,application/pdf"
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={status === 'idle' || status === 'error' ? triggerFileSelect : undefined}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 backdrop-blur-md bg-neutral-900/10",
          isDragging 
            ? "border-purple-500 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)] scale-[0.99]" 
            : "border-neutral-800 hover:border-neutral-700/80 hover:bg-neutral-800/10",
          status === 'uploading' || status === 'extracting' ? "pointer-events-none opacity-80" : ""
        )}
      >
        {status === 'idle' && (
          <>
            <div className="p-4 rounded-full bg-neutral-950/60 border border-neutral-800 text-neutral-400 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-all duration-300 shadow-inner">
              <UploadCloud className="w-8 h-8 text-neutral-400" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-sm font-semibold text-neutral-200">
                Drag & drop your resume PDF, or <span className="text-purple-400 hover:underline">browse</span>
              </p>
              <p className="text-xs text-neutral-500">Supports PDF only (Max 10 MB)</p>
            </div>
          </>
        )}

        {status === 'uploading' && (
          <div className="w-full flex flex-col items-center gap-4 py-4">
            <div className="p-3.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 animate-pulse">
              <FileText className="w-6 h-6" />
            </div>
            <div className="w-full max-w-xs flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-medium text-neutral-400">
                <span className="truncate max-w-[200px]">{uploadedFileName}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-center text-xs text-neutral-500">Uploading file...</span>
            </div>
          </div>
        )}

        {status === 'extracting' && (
          <div className="w-full flex flex-col items-center gap-4 py-4">
            <div className="p-3.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-sm font-semibold text-neutral-200">Extracting Document Text</p>
              <p className="text-xs text-neutral-500">Parsing layout contents with PyMuPDF...</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="p-3.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-sm font-semibold text-rose-400">Extraction Failed</p>
              <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetUploader();
              }}
              className="mt-2 text-xs font-semibold px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg text-neutral-300 transition-all"
            >
              Reset Uploader
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
