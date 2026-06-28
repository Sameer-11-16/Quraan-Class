import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';

export async function GET() {
  try {
    await dbConnect();
    const batches = await Batch.find({}).sort({ createdAt: 1 });
    // Transform _id to id for frontend compatibility
    const formattedBatches = batches.map((b) => ({
      id: b._id.toString(),
      name: b.name,
    }));
    return NextResponse.json({ success: true, data: formattedBatches });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ success: false, error: 'Batch name is required' }, { status: 400 });
    }
    await dbConnect();
    const batch = await Batch.create({ name });
    return NextResponse.json({
      success: true,
      data: { id: batch._id.toString(), name: batch.name },
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
      return NextResponse.json({ success: false, error: 'Batch ID is required' }, { status: 400 });
    }
    await dbConnect();
    await Batch.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Batch deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
