import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/lib/models/Attendance';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const batch = searchParams.get('batch');

    if (!date || !batch) {
      return NextResponse.json({ success: false, error: 'Missing date or batch query parameters' }, { status: 400 });
    }

    await dbConnect();
    
    const attendance = await Attendance.findOne({ date, batch });
    
    if (attendance) {
      // Convert Map to plain object for frontend
      const recordsObj = Object.fromEntries(attendance.records);
      return NextResponse.json({ success: true, data: { date: attendance.date, batch: attendance.batch.toString(), records: recordsObj } });
    } else {
      return NextResponse.json({ success: true, data: null });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { date, batch, records } = body;

    if (!date || !batch || !records) {
      return NextResponse.json({ success: false, error: 'Missing date, batch, or records in request body' }, { status: 400 });
    }

    await dbConnect();

    // Use findOneAndUpdate with upsert: true to either update existing or create new
    const updated = await Attendance.findOneAndUpdate(
      { date, batch },
      { $set: { records } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
