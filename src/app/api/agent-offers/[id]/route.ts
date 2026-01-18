import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOfferById, updateAgentOffer, deleteAgentOffer } from '@/lib/data';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const offer = getOfferById(id);

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const userRole = session.user.role;
    const agentId = session.user.id;

    const updatedOffer = await updateAgentOffer(id, body, userRole, agentId);

    if (!updatedOffer) {
      return NextResponse.json({ error: 'Offer not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userRole = session.user.role;
    const agentId = session.user.id;

    const success = await deleteAgentOffer(id, userRole, agentId);

    if (!success) {
      return NextResponse.json({ error: 'Offer not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
