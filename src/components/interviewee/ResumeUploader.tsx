// "use client";
// import React, { useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setCandidateInfo } from "@/store/interviewSlice";

// export default function ResumeUploader({ onParsed }: { onParsed?: (info: any) => void }) {
//   const [file, setFile] = useState<File | null>(null);
//   const [parsing, setParsing] = useState(false);
//   const dispatch = useDispatch();

//   async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setFile(f);
//     setParsing(true);

//     const formData = new FormData();
//     formData.append("file", f);

//     // call server route to parse file
//     try {
//       const res = await axios.post("/api/resume/parse", formData, { headers: { "Content-Type": "multipart/form-data" } });
//       const info = res.data;
//       dispatch(setCandidateInfo(info));
//       onParsed?.(info);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to parse. Try upload PDF or fill details manually.");
//     } finally {
//       setParsing(false);
//     }
//   }

//   return (
//     <div className="p-4 border rounded">
//       <label className="block mb-2">Upload Resume (PDF or DOCX)</label>
//       <input type="file" accept=".pdf,.docx" onChange={handleUpload} />
//       {parsing && <p>Parsing resume…</p>}
//       {file && <p>Uploaded: {file.name}</p>}
//     </div>
//   );
// }


// import React, { useState, useRef } from "react";
// import { Upload, FileText, CheckCircle, XCircle, Loader2, User, Mail, Phone, Award, Briefcase, Calendar, MapPin, Sparkles, AlertTriangle, X, Download, Eye, EyeOff } from "lucide-react";

// interface ParsedResumeInfo {
//   name: string | null;
//   email: string | null;
//   phone: string | null;
//   skills: string[];
//   yearsOfExperience: number | null;
//   rawText: string;
// }

// export default function ResumeUploader({ onParsed }: { onParsed?: (info: ParsedResumeInfo) => void }) {
//   const [file, setFile] = useState<File | null>(null);
//   const [parsing, setParsing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [parsedInfo, setParsedInfo] = useState<ParsedResumeInfo | null>(null);
//   const [dragActive, setDragActive] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [showRawText, setShowRawText] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Validation constants
//   const ALLOWED_TYPES = {
//     'application/pdf': 'PDF',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
//     'text/plain': 'TXT'
//   };
//   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

//   const validateFile = (file: File): { valid: boolean; error?: string } => {
//     // Check file type
//     if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
//       return {
//         valid: false,
//         error: `Invalid file type. Please upload PDF, DOCX, or TXT files only.`
//       };
//     }

//     // Check file size
//     if (file.size > MAX_FILE_SIZE) {
//       return {
//         valid: false,
//         error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the 5MB limit.`
//       };
//     }

//     // Check if file is empty
//     if (file.size === 0) {
//       return {
//         valid: false,
//         error: 'The uploaded file is empty. Please select a valid resume.'
//       };
//     }

//     return { valid: true };
//   };

//   const simulateProgress = () => {
//     setUploadProgress(0);
//     const interval = setInterval(() => {
//       setUploadProgress(prev => {
//         if (prev >= 90) {
//           clearInterval(interval);
//           return 90;
//         }
//         return prev + 10;
//       });
//     }, 200);
//     return interval;
//   };

//   const handleUpload = async (selectedFile: File) => {
//     // Validate file
//     const validation = validateFile(selectedFile);
//     if (!validation.valid) {
//       setError(validation.error || 'Invalid file');
//       return;
//     }

//     setFile(selectedFile);
//     setParsing(true);
//     setError(null);
//     setParsedInfo(null);

//     const progressInterval = simulateProgress();

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       // Simulate API call - replace with actual API endpoint
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Mock response - replace with actual API call
//     //   const mockData: ParsedResumeInfo = {
//     //     name: "John Doe",
//     //     email: "john.doe@example.com",
//     //     phone: "+1 (555) 123-4567",
//     //     skills: ["JavaScript", "TypeScript", "React", "Node.js", "Next.js", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL"],
//     //     yearsOfExperience: 5,
//     //     rawText: "John Doe\nSenior Full Stack Developer\n\nContact: john.doe@example.com | +1 (555) 123-4567\n\nExperienced software engineer with 5 years of expertise in building scalable web applications..."
//     //   };

//       clearInterval(progressInterval);
//       setUploadProgress(100);
      
//     //   setTimeout(() => {
//     //     setParsedInfo(mockData);
//     //     onParsed?.(mockData);
//     //   }, 500);

//       // Actual API call implementation:
//       const res = await fetch("/api/resume/parse", {
//         method: "POST",
//         body: formData
//       });

//       const data = await res.json();
      
//       clearInterval(progressInterval);
//       setUploadProgress(100);

//       if (data.success) {
//         setParsedInfo(data.data);
//         onParsed?.(data.data);
//       } else {
//         setError(data.error || "Failed to parse resume");
//       }


//     } catch (err: any) {
//       clearInterval(progressInterval);
//       console.error("Resume parsing error:", err);
//       setError(err.message || "Failed to parse resume. Please try again or fill details manually.");
//       setUploadProgress(0);
//     } finally {
//       setParsing(false);
//     }
//   };

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       handleUpload(selectedFile);
//     }
//   };

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleUpload(e.dataTransfer.files[0]);
//     }
//   };

//   const handleClear = () => {
//     setFile(null);
//     setError(null);
//     setParsedInfo(null);
//     setUploadProgress(0);
//     setShowRawText(false);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const getFileIcon = () => {
//     if (!file) return null;
//     const ext = file.name.split('.').pop()?.toLowerCase();
//     return ext === 'pdf' ? '📄' : ext === 'docx' ? '📘' : '📝';
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-6">
//       <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
//               <Sparkles className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-white">Resume Parser</h2>
//               <p className="text-blue-100 text-sm">Upload your resume and let AI extract the details</p>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Upload Area */}
//           {!file ? (
//             <div
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//               className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
//                 dragActive
//                   ? 'border-blue-500 bg-blue-50 scale-105'
//                   : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
//               }`}
//             >
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".pdf,.docx,.txt"
//                 onChange={handleFileInput}
//                 className="hidden"
//                 id="resume-upload"
//                 disabled={parsing}
//               />
//               <label htmlFor="resume-upload" className="cursor-pointer">
//                 <div className="flex flex-col items-center space-y-4">
//                   <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
//                     <Upload className="h-10 w-10 text-white" />
//                   </div>
                  
//                   <div>
//                     <p className="text-xl font-semibold text-gray-800 mb-2">
//                       {dragActive ? "Drop your resume here" : "Upload Your Resume"}
//                     </p>
//                     <p className="text-gray-600 mb-1">
//                       Drag and drop or click to browse
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Supports PDF, DOCX, and TXT files up to 5MB
//                     </p>
//                   </div>

//                   <div className="flex items-center space-x-4 pt-4">
//                     {Object.values(ALLOWED_TYPES).map((type, idx) => (
//                       <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
//                         {type}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </label>
//             </div>
//           ) : (
//             /* File Info Card */
//             <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center space-x-4 flex-1">
//                   <div className="text-4xl">{getFileIcon()}</div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-gray-800 text-lg">{file.name}</p>
//                     <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
//                       <span>{(file.size / 1024).toFixed(2)} KB</span>
//                       <span>•</span>
//                       <span>{file.type.split('/').pop()?.toUpperCase()}</span>
//                       <span>•</span>
//                       <span>{new Date(file.lastModified).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   {parsing ? (
//                     <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
//                   ) : error ? (
//                     <XCircle className="h-6 w-6 text-red-600" />
//                   ) : parsedInfo ? (
//                     <CheckCircle className="h-6 w-6 text-green-600" />
//                   ) : null}
                  
//                   {!parsing && (
//                     <button
//                       onClick={handleClear}
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                       title="Remove file"
//                     >
//                       <X className="h-5 w-5 text-gray-500" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               {parsing && uploadProgress > 0 && (
//                 <div className="mb-4">
//                   <div className="flex justify-between text-sm text-gray-600 mb-2">
//                     <span>Parsing resume...</span>
//                     <span>{uploadProgress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
//                       style={{ width: `${uploadProgress}%` }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {!parsing && !error && !parsedInfo && (
//                 <button
//                   onClick={handleClear}
//                   className="w-full mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
//                 >
//                   Upload a different file
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Parsing Status */}
//           {parsing && !error && (
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
//               <div className="flex items-center space-x-3">
//                 <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
//                 <div>
//                   <p className="text-blue-900 font-medium">Analyzing your resume...</p>
//                   <p className="text-blue-700 text-sm mt-1">Extracting contact info, skills, and experience</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
//               <div className="flex items-start space-x-3">
//                 <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="text-red-900 font-semibold">Upload Failed</p>
//                   <p className="text-red-700 text-sm mt-1">{error}</p>
//                   <button
//                     onClick={handleClear}
//                     className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
//                   >
//                     Try Again
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Parsed Information Display */}
//           {parsedInfo && !parsing && (
//             <div className="space-y-6 animate-fadeIn">
//               {/* Success Banner */}
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
//                     <CheckCircle className="h-6 w-6 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-green-900 font-semibold text-lg">Resume Parsed Successfully!</p>
//                     <p className="text-green-700 text-sm">All information has been extracted and validated</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Contact Information Section */}
//               <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
//                   <User className="h-5 w-5 text-blue-600" />
//                   <span>Contact Information</span>
//                 </h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {parsedInfo.name && (
//                     <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
//                           <User className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 uppercase font-medium">Full Name</p>
//                           <p className="text-gray-900 font-semibold mt-0.5">{parsedInfo.name}</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {parsedInfo.email && (
//                     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
//                           <Mail className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 uppercase font-medium">Email Address</p>
//                           <p className="text-gray-900 font-semibold mt-0.5 truncate">{parsedInfo.email}</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {parsedInfo.phone && (
//                     <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-100">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
//                           <Phone className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 uppercase font-medium">Phone Number</p>
//                           <p className="text-gray-900 font-semibold mt-0.5">{parsedInfo.phone}</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {parsedInfo.yearsOfExperience !== null && (
//                     <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
//                           <Award className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-600 uppercase font-medium">Experience</p>
//                           <p className="text-gray-900 font-semibold mt-0.5">
//                             {parsedInfo.yearsOfExperience} {parsedInfo.yearsOfExperience === 1 ? 'year' : 'years'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {(!parsedInfo.name && !parsedInfo.email && !parsedInfo.phone && parsedInfo.yearsOfExperience === null) && (
//                   <div className="text-center py-4">
//                     <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
//                     <p className="text-gray-600 text-sm">No contact information detected</p>
//                   </div>
//                 )}
//               </div>

//               {/* Skills Section */}
//               {parsedInfo.skills && parsedInfo.skills.length > 0 && (
//                 <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
//                     <Briefcase className="h-5 w-5 text-purple-600" />
//                     <span>Detected Skills</span>
//                     <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
//                       {parsedInfo.skills.length}
//                     </span>
//                   </h3>
                  
//                   <div className="flex flex-wrap gap-2">
//                     {parsedInfo.skills.map((skill, idx) => (
//                       <span
//                         key={idx}
//                         className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Raw Text Section */}
//               {parsedInfo.rawText && (
//                 <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
//                   <button
//                     onClick={() => setShowRawText(!showRawText)}
//                     className="w-full flex items-center justify-between text-left group"
//                   >
//                     <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
//                       <FileText className="h-5 w-5 text-gray-600" />
//                       <span>Extracted Text</span>
//                     </h3>
//                     {showRawText ? (
//                       <EyeOff className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
//                     )}
//                   </button>
                  
//                   {showRawText && (
//                     <div className="mt-4 bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-200">
//                       <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
//                         {parsedInfo.rawText}
//                       </pre>
//                       <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
//                         Total characters: {parsedInfo.rawText.length.toLocaleString()}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex space-x-3">
//                 <button
//                   onClick={handleClear}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
//                 >
//                   <Upload className="h-5 w-5" />
//                   <span>Upload Another Resume</span>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Info Footer */}
//           {!file && (
//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//               <div className="flex items-start space-x-3">
//                 <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                 <div className="text-sm text-blue-800">
//                   <p className="font-semibold mb-1">What we extract:</p>
//                   <ul className="space-y-1 text-blue-700">
//                     <li>• Contact information (name, email, phone)</li>
//                     <li>• Professional skills and technologies</li>
//                     <li>• Years of experience</li>
//                     <li>• Complete resume text for AI analysis</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }




// ---------------------

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, XCircle, Loader2, User, Mail, Phone, Award, Briefcase, Calendar, MapPin, Sparkles, AlertTriangle, X, Download, Eye, EyeOff } from "lucide-react";

interface ParsedResumeInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  yearsOfExperience: number | null;
  rawText: string;
}

export default function ResumeUploader({ onParsed }: { onParsed?: (info: ParsedResumeInfo) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedInfo, setParsedInfo] = useState<ParsedResumeInfo | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showRawText, setShowRawText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation constants
  const ALLOWED_TYPES = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'text/plain': 'TXT'
  };
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!Object.keys(ALLOWED_TYPES).includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Please upload PDF, DOCX, or TXT files only.`
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the 5MB limit.`
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        valid: false,
        error: 'The uploaded file is empty. Please select a valid resume.'
      };
    }

    return { valid: true };
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    return interval;
  };

  const handleUpload = async (selectedFile: File) => {
    // Validate file
    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
    setParsing(true);
    setError(null);
    setParsedInfo(null);

    const progressInterval = simulateProgress();

    try {
      // Client-side parsing (no server needed - avoids all server PDF issues)
      const { parseResumeClientSide, analyzeResume } = await import('@/src/lib/client-resume-parser');
      
      const text = await parseResumeClientSide(selectedFile);
      const analysis = analyzeResume(text);

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setParsedInfo(analysis);
        onParsed?.(analysis);
      }, 300);

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error("Resume parsing error:", err);
      setError(err.message || "Failed to parse resume. Please try again or fill details manually.");
      setUploadProgress(0);
    } finally {
      setParsing(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setParsedInfo(null);
    setUploadProgress(0);
    setShowRawText(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ext === 'pdf' ? '📄' : ext === 'docx' ? '📘' : '📝';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Resume Parser</h2>
              <p className="text-blue-100 text-sm">Upload your resume and let AI extract the details</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Area */}
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 scale-105'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="resume-upload"
                disabled={parsing}
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                      {dragActive ? "Drop your resume here" : "Upload Your Resume"}
                    </p>
                    <p className="text-gray-600 mb-1">
                      Drag and drop or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF, DOCX, and TXT files up to 5MB
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    {Object.values(ALLOWED_TYPES).map((type, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            </div>
          ) : (
            /* File Info Card */
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-4xl">{getFileIcon()}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-lg">{file.name}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{(file.size / 1024).toFixed(2)} KB</span>
                      <span>•</span>
                      <span>{file.type.split('/').pop()?.toUpperCase()}</span>
                      <span>•</span>
                      <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {parsing ? (
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  ) : error ? (
                    <XCircle className="h-6 w-6 text-red-600" />
                  ) : parsedInfo ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : null}
                  
                  {!parsing && (
                    <button
                      onClick={handleClear}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {parsing && uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Parsing resume...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {!parsing && !error && !parsedInfo && (
                <button
                  onClick={handleClear}
                  className="w-full mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                >
                  Upload a different file
                </button>
              )}
            </div>
          )}

          {/* Parsing Status */}
          {parsing && !error && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
                <div>
                  <p className="text-blue-900 font-medium">Analyzing your resume...</p>
                  <p className="text-blue-700 text-sm mt-1">Extracting contact info, skills, and experience</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-900 font-semibold">Upload Failed</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  <button
                    onClick={handleClear}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Parsed Information Display */}
          {parsedInfo && !parsing && (
            <div className="space-y-6 animate-fadeIn">
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-green-900 font-semibold text-lg">Resume Parsed Successfully!</p>
                    <p className="text-green-700 text-sm">All information has been extracted and validated</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              {/* <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Contact Information</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parsedInfo.name && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-medium">Full Name</p>
                          <p className="text-gray-900 font-semibold mt-0.5">{parsedInfo.name}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {parsedInfo.email && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-medium">Email Address</p>
                          <p className="text-gray-900 font-semibold mt-0.5 truncate">{parsedInfo.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {parsedInfo.phone && (
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-medium">Phone Number</p>
                          <p className="text-gray-900 font-semibold mt-0.5">{parsedInfo.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {parsedInfo.yearsOfExperience !== null && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-medium">Experience</p>
                          <p className="text-gray-900 font-semibold mt-0.5">
                            {parsedInfo.yearsOfExperience} {parsedInfo.yearsOfExperience === 1 ? 'year' : 'years'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {(!parsedInfo.name && !parsedInfo.email && !parsedInfo.phone && parsedInfo.yearsOfExperience === null) && (
                  <div className="text-center py-4">
                    <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No contact information detected</p>
                  </div>
                )}
              </div> */}

              {/* Editable Contact Info */}
<div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
    <User className="h-5 w-5 text-blue-600" />
    <span>Verify / Edit Your Contact Information</span>
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Full Name *</label>
      <input
        type="text"
        value={parsedInfo.name || ""}
        onChange={(e) => setParsedInfo({ ...parsedInfo!, name: e.target.value })}
        className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Email *</label>
      <input
        type="email"
        value={parsedInfo.email || ""}
        onChange={(e) => setParsedInfo({ ...parsedInfo!, email: e.target.value })}
        className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Phone *</label>
      <input
        type="text"
        value={parsedInfo.phone || ""}
        onChange={(e) => setParsedInfo({ ...parsedInfo!, phone: e.target.value })}
        className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  </div>

  <div className="mt-4 flex justify-end">
    <button
      onClick={() => {
        if (!parsedInfo?.name || !parsedInfo?.email || !parsedInfo?.phone) {
          alert("Please fill all mandatory fields before continuing.");
          return;
        }
        onParsed?.(parsedInfo);
      }}
      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700"
    >
      Confirm & Continue
    </button>
  </div>
</div>


              {/* Skills Section */}
              {parsedInfo.skills && parsedInfo.skills.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    <span>Detected Skills</span>
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      {parsedInfo.skills.length}
                    </span>
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {parsedInfo.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Text Section */}
              {parsedInfo.rawText && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <button
                    onClick={() => setShowRawText(!showRawText)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <span>Extracted Text</span>
                    </h3>
                    {showRawText ? (
                      <EyeOff className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    )}
                  </button>
                  
                  {showRawText && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-200">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {parsedInfo.rawText}
                      </pre>
                      <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                        Total characters: {parsedInfo.rawText.length.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClear}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Another Resume</span>
                </button>
              </div>
            </div>
          )}

          {/* Info Footer */}
          {!file && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">What we extract:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Contact information (name, email, phone)</li>
                    <li>• Professional skills and technologies</li>
                    <li>• Years of experience</li>
                    <li>• Complete resume text for AI analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}