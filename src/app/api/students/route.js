import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Student from '@/lib/models/Student';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');
    
    await dbConnect();
    
    let query = {};
    if (batchId) {
      query.batch = batchId;
    }
    
    const students = await Student.find(query).sort({ createdAt: 1 });
    // Transform _id to id for frontend compatibility
    const formattedStudents = students.map((s) => ({
      id: s._id.toString(),
      name: s.name,
      code: s.code,
      batch: s.batch.toString(),
    }));
    return NextResponse.json({ success: true, data: formattedStudents });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, code, batchId } = await request.json();
    if (!name || !code || !batchId) {
      return NextResponse.json({ success: false, error: 'Name, code, and batchId are required' }, { status: 400 });
    }
    await dbConnect();
    const student = await Student.create({ name, code, batch: batchId });
    return NextResponse.json({
      success: true,
      data: {
        id: student._id.toString(),
        name: student.name,
        code: student.code,
        batch: student.batch.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 });
    }
    await dbConnect();
    await Student.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
