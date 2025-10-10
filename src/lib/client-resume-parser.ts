// src/lib/client-resume-parser.ts
// This runs only in the browser to avoid server-side PDF parsing issues

export async function parseResumeClientSide(file: File): Promise<string> {
  const ext = file.name.toLowerCase().split('.').pop();
  
  switch (ext) {
    case 'pdf':
      return parsePDFClientSide(file);
    case 'docx':
      return parseDOCXClientSide(file);
    case 'txt':
      return parseTextFile(file);
    default:
      throw new Error(`Unsupported file type: .${ext}`);
  }
}

async function parsePDFClientSide(file: File): Promise<string> {
  try {
    // Dynamically import pdfjs-dist for client-side only
    const pdfjsLib = await import('pdfjs-dist');
    
    // Use local worker from node_modules
    if (typeof window !== 'undefined') {
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
        new Blob([pdfjsWorker], { type: 'application/javascript' })
      );
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false
    });
    
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

async function parseDOCXClientSide(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error: any) {
    console.error('DOCX parsing error:', error);
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
}

async function parseTextFile(file: File): Promise<string> {
  try {
    return await file.text();
  } catch (error: any) {
    console.error('Text parsing error:', error);
    throw new Error(`Failed to parse text file: ${error.message}`);
  }
}

// Analysis functions
export function extractContactInfo(text: string) {
  if (!text) {
    return { name: null, email: null, phone: null, rawText: '' };
  }

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);

  const lines = text
    .split(/[\n\r]+/)
    .map(l => l.trim())
    .filter(Boolean);

  let nameMatch: string | null = null;

  // Strategy 1: First non-header line as full name
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (/^(resume|curriculum vitae|cv)$/i.test(line)) continue;
    const words = line.split(/\s+/);

    // Full name check (2–4 words)
    if (words.length >= 2 && words.length <= 4 && /^[A-Za-z\s.'-]+$/.test(line)) {
      nameMatch = line;
      break;
    }
  }

  // Strategy 2: fallback → first word in resume
  if (!nameMatch && lines.length > 0) {
    const firstWord = lines[0].split(/\s+/)[0];
    if (/^[A-Za-z.'-]+$/.test(firstWord)) {
      nameMatch = firstWord;
    }
  }

  // Strategy 3: fallback → email prefix
  if (!nameMatch && emailMatch) {
    nameMatch = emailMatch[0].split('@')[0].replace(/[._\d]+/g, ' ').trim();
  }

  return {
    name: nameMatch || null,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    rawText: text,
  };
}


export function extractSkills(text: string): string[] {
  if (!text) return [];

  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'React', 'Angular', 'Vue', 'Next\\.js', 'Nuxt', 'Svelte', 'HTML', 'CSS',
    'Node\\.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'CI/CD'
  ];
  
  const foundSkills: string[] = [];
  
  skillKeywords.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'gi');
    const match = text.match(regex);
    if (match && !foundSkills.some(s => s.toLowerCase() === match[0].toLowerCase())) {
      foundSkills.push(match[0]);
    }
  });
  
  return foundSkills;
}

export function extractYearsOfExperience(text: string): number | null {
  if (!text) return null;

  const patterns = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
    /experience[:\s]+(\d+)\+?\s*years?/i,
    /(\d+)\+?\s*yrs?\s+(?:of\s+)?exp/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const years = parseInt(match[1], 10);
      if (years > 0 && years < 100) {
        return years;
      }
    }
  }
  
  return null;
}

export interface ResumeAnalysis {
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  yearsOfExperience: number | null;
  rawText: string;
}

export function analyzeResume(text: string): ResumeAnalysis {
  const contactInfo = extractContactInfo(text);
  const skills = extractSkills(text);
  const yearsOfExperience = extractYearsOfExperience(text);
  
  return {
    ...contactInfo,
    skills,
    yearsOfExperience
  };
}