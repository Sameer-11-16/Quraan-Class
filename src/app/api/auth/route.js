import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AppConfig from '@/lib/models/AppConfig';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    const config = await AppConfig.findOne({ key: 'app_pin' });
    
    // Returns true if a PIN has been set, false otherwise
    return NextResponse.json({ success: true, isPinSet: !!config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action, pin } = await request.json();
    
    if (!pin || pin.length !== 4) {
      return NextResponse.json({ success: false, error: 'A 4-digit PIN is required' }, { status: 400 });
    }

    await dbConnect();
    const config = await AppConfig.findOne({ key: 'app_pin' });

    if (action === 'setup') {
      if (config) {
        return NextResponse.json({ success: false, error: 'PIN is already set' }, { status: 400 });
      }
      
      const hashedPin = await bcrypt.hash(pin, 10);
      await AppConfig.create({ key: 'app_pin', value: hashedPin });
      
      return NextResponse.json({ success: true, message: 'PIN set successfully' });
    } 
    
    else if (action === 'verify') {
      if (!config) {
        return NextResponse.json({ success: false, error: 'PIN has not been set yet' }, { status: 400 });
      }
      
      const isValid = await bcrypt.compare(pin, config.value);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Incorrect PIN' }, { status: 401 });
      }
      
      return NextResponse.json({ success: true, message: 'Authenticated successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
