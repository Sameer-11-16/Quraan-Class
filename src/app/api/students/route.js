import { NextResponse } from 'next/server';
import { STUDENTS } from '@/lib/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const batch = searchParams.get('batch');

  let students = STUDENTS;
  if (batch) {
    students = STUDENTS.filter((s) => s.batch === batch);
  }

  return NextResponse.json({ students });
}
