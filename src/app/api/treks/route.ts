import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllTreks, addTrek, updateTrek, deleteTrek } from '@/lib/data';

export async function GET() {
  return NextResponse.json(getAllTreks());
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // For agencies: automatically set agencyId, admins can specify
    if (session.user.role === 'agency') {
      body.agencyId = session.user.id; // Use user id as agency id
    }
    
    const newTrek = await addTrek(body);
    return NextResponse.json(newTrek, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, patch } = await req.json();
    
    // Permission check: agencies can only edit their own treks
    const updated = await updateTrek(id, patch, session.user.role, session.user.id);
    
    if (!updated) {
      return NextResponse.json(
        { error: session.user.role === 'agency' ? 'Forbidden or Not found' : 'Not found' }, 
        { status: session.user.role === 'agency' ? 403 : 404 }
      );
    }
    
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    
    // Permission check: agencies can only delete their own treks
    const ok = await deleteTrek(id, session.user.role, session.user.id);
    
    if (!ok) {
      return NextResponse.json(
        { error: session.user.role === 'agency' ? 'Forbidden or Not found' : 'Not found' }, 
        { status: session.user.role === 'agency' ? 403 : 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}
