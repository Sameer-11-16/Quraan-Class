import { NextResponse } from 'next/server';

// In-memory store for server-side (complements client-side localStorage)
const attendanceStore = new Map();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const batch = searchParams.get('batch');

  if (!date || !batch) {
    return NextResponse.json(
      { error: 'Date and batch are required' },
      { status: 400 }
    );
  }

  const key = `${date}_${batch}`;
  const data = attendanceStore.get(key);

  return NextResponse.json({ attendance: data || null });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { date, batch, records } = body;

    if (!date || !batch || !records) {
      return NextResponse.json(
        { error: 'Date, batch, and records are required' },
        { status: 400 }
      );
    }

    const key = `${date}_${batch}`;
    attendanceStore.set(key, {
      date,
      batch,
      records,
      savedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save attendance' },
      { status: 500 }
    );
  }
}
