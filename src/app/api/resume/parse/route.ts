// src/app/api/resume/parse/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parseResume, analyzeResume } from '@/src/lib/resume';

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Only PDF, DOCX, and TXT files are allowed.'
        },
        { status: 400 }
      );
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Parse the resume
    const text = await parseResume(buffer, file.name);
    
    // Analyze and extract information
    const analysis = analyzeResume(text);
    
    return NextResponse.json({
      success: true,
      data: analysis
    });
    
  } catch (error: any) {
    console.error('Resume parsing error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to parse resume. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}