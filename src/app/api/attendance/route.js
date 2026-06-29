import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/lib/models/Attendance';
import Batch from '@/lib/models/Batch';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const batch = searchParams.get('batch');

    await dbConnect();

    // If parameters are missing, return all attendance history
    if (!date && !batch) {
      const allRecords = await Attendance.find({}).sort({ date: -1 }).populate('batch', 'name');
      const historyList = allRecords.map(rec => {
        const rawRecords = rec.records || new Map();
        const recordsObj = rawRecords instanceof Map ? Object.fromEntries(rawRecords) : (rawRecords || {});
        let total = 0;
        let present = 0;
        let absent = 0;
        Object.values(recordsObj).forEach((studentRec) => {
          total++;
          if (studentRec?.classAttendance === 'Present') present++;
          if (studentRec?.classAttendance === 'Absent') absent++;
        });

        return {
          id: rec._id.toString(),
          date: rec.date,
          batchId: rec.batch?._id?.toString() || '',
          batchName: rec.batch?.name || 'Unknown Batch',
          totalStudents: total,
          classPresentCount: present,
          classAbsentCount: absent,
        };
      });
      return NextResponse.json({ success: true, data: historyList });
    }

    if (!date || !batch) {
      return NextResponse.json({ success: false, error: 'Missing date or batch query parameters' }, { status: 400 });
    }

    const attendance = await Attendance.findOne({ date, batch }).lean();
    
    if (attendance) {
      // Properly convert Map (stored as plain object in .lean()) to safe plain object
      const rawRecords = attendance.records || {};
      const recordsObj = {};
      
      Object.entries(rawRecords).forEach(([studentId, rec]) => {
        recordsObj[studentId] = {
          classAttendance: rec?.classAttendance || '',
          halqaAttendance: rec?.halqaAttendance || '',
          halqaParticipation: rec?.halqaParticipation || '',
          notesMarks: rec?.notesMarks || '',
          homework: rec?.homework || '',
          followUp: rec?.followUp || '',
          remark: rec?.remark || '',
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          date: attendance.date,
          batch: attendance.batch.toString(),
          records: recordsObj,
        },
      });
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
      { new: true, upsert: true, lean: true }
    );

    return NextResponse.json({ success: true, data: { date: updated.date, batch: updated.batch.toString() } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
