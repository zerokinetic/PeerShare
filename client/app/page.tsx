"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, Copy, Check, File, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  code: string
  status: "uploading" | "completed" | "error"
  progress: number
}

interface DownloadFile {
  name: string
  size: number
  status: "downloading" | "completed" | "error"
  progress: number
}

export default function PeerShare() {
  const [activeSection, setActiveSection] = useState<"upload" | "download">("upload")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [downloadCode, setDownloadCode] = useState("")
  const [downloadFile, setDownloadFile] = useState<DownloadFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        code: generateCode(),
        status: "uploading",
        progress: 0,
      }

      setUploadedFiles((prev) => [...prev, newFile])

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (f.id === newFile.id) {
              const newProgress = Math.min(f.progress + Math.random() * 20, 100)
              return {
                ...f,
                progress: newProgress,
                status: newProgress === 100 ? "completed" : "uploading",
              }
            }
            return f
          }),
        )
      }, 200)

      setTimeout(() => clearInterval(interval), 3000)
    })
  }

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleDownload = () => {
    if (downloadCode.length === 6) {
      const mockFile: DownloadFile = {
        name: "document.pdf",
        size: 2048576,
        status: "downloading",
        progress: 0,
      }

      setDownloadFile(mockFile)

      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadFile((prev) => {
          if (!prev) return null
          const newProgress = Math.min(prev.progress + Math.random() * 15, 100)
          return {
            ...prev,
            progress: newProgress,
            status: newProgress === 100 ? "completed" : "downloading",
          }
        })
      }, 300)

      setTimeout(() => clearInterval(interval), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PeerShare
          </h1>
          <p className="text-muted-foreground text-lg">secure P2P file sharing platform</p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-8">
          <div className="bg-card border border-border rounded-lg p-1 flex">
            <Button
              variant={activeSection === "upload" ? "default" : "ghost"}
              onClick={() => setActiveSection("upload")}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-md transition-all",
                activeSection === "upload"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button
              variant={activeSection === "download" ? "default" : "ghost"}
              onClick={() => setActiveSection("download")}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-md transition-all",
                activeSection === "download"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {activeSection === "upload" ? (
            /* Upload Section */
            <Card className="ring-2 ring-primary/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drag & Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                    isDragOver
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-accent/5",
                  )}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Support for any file type up to 100MB</p>
                  <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground">Uploaded Files</h3>
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="bg-muted/30 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <File className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{file.name}</p>
                              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                file.status === "completed"
                                  ? "default"
                                  : file.status === "error"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {file.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {file.status === "uploading" && <Progress value={file.progress} className="h-2" />}

                        {file.status === "completed" && (
                          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded border">
                            <span className="text-sm font-mono font-medium flex-1">Code: {file.code}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyCode(file.code)}
                              className="h-8 w-8 p-0"
                            >
                              {copiedCode === file.code ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Download Section */
            <Card className="ring-2 ring-primary/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-accent" />
                  Download Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Code Input */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Enter 6-digit code</label>
                    <div className="flex gap-2">
                      <Input
                        value={downloadCode}
                        onChange={(e) => setDownloadCode(e.target.value.toUpperCase().slice(0, 6))}
                        placeholder="ABC123"
                        className="font-mono text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                      <Button onClick={handleDownload} disabled={downloadCode.length !== 6} className="px-6">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Download Status */}
                {downloadFile && (
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="w-4 h-4 text-accent" />
                        <div>
                          <p className="font-medium">{downloadFile.name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(downloadFile.size)}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          downloadFile.status === "completed"
                            ? "default"
                            : downloadFile.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {downloadFile.status}
                      </Badge>
                    </div>

                    {downloadFile.status === "downloading" && (
                      <div className="space-y-2">
                        <Progress value={downloadFile.progress} className="h-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          {Math.round(downloadFile.progress)}% complete
                        </p>
                      </div>
                    )}

                    {downloadFile.status === "completed" && (
                      <div className="text-center">
                        <p className="text-sm text-green-400 font-medium">✓ Download completed successfully</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                  <h4 className="font-medium text-accent mb-2">How it works:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Get a 6-digit code from the sender</li>
                    <li>• Enter the code in the field above</li>
                    <li>• Click download to start the transfer</li>
                    <li>• Files are transferred directly between devices</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
