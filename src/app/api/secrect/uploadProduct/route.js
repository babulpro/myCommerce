import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary will automatically use CLOUDINARY_URL from environment
// No need to manually configure if using CLOUDINARY_URL

export async function POST(request) {
  try {
    console.log('=== UPLOAD STARTED ===');
    console.log('Cloudinary URL present:', !!process.env.CLOUDINARY_URL);

    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Convert file to base64 (more reliable)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Image}`;

    console.log('Uploading to Cloudinary...');

    // Use upload method instead of upload_stream
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'houserent',
      resource_type: 'image',
      // Remove transformation parameters for now to simplify
    });

    console.log('Upload successful:', result.secure_url);

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url
    });

  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message }, 
      { status: 500 }
    );
  }
}