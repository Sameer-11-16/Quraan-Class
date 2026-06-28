import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Student from '@/lib/models/Student';

export async function POST(request) {
  try {
    const { students } = await request.json(); // Array of { name, code, batchId }
    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ success: false, error: 'Valid students array is required' }, { status: 400 });
    }
    
    await dbConnect();
    
    // Map to MongoDB schema structure
    const docs = students.map(s => ({
      name: s.name,
      code: s.code,
      batch: s.batchId
    }));
    
    const inserted = await Student.insertMany(docs);
    
    const formatted = inserted.map(s => ({
      id: s._id.toString(),
      name: s.name,
      code: s.code,
      batch: s.batch.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
