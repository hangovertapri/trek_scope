import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getAllAgentOffers,
  getOffersByAgentId,
  getOffersByTrekId,
  addAgentOffer,
  getAgentById,
} from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const trekId = searchParams.get('trekId');

    let offers;
    if (agentId) {
      offers = getOffersByAgentId(agentId);
    } else if (trekId) {
      offers = getOffersByTrekId(trekId);
    } else {
      offers = getAllAgentOffers();
    }

    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching agent offers:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const agentId = session.user.id;
    const agent = getAgentById(agentId);
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const body = await request.json();
    
    const newOffer = await addAgentOffer({
      agent_id: agentId,
      agent_name: agent.agency_name,
      agent_rating: agent.rating,
      trek_id: body.trek_id,
      trek_slug: body.trek_slug,
      price_usd: body.price_usd,
      group_size_min: body.group_size_min,
      group_size_max: body.group_size_max,
      availability_start: body.availability_start,
      availability_end: body.availability_end,
      includes: body.includes,
      excludes: body.excludes,
      custom_notes: body.custom_notes || '',
      booking_terms: body.booking_terms,
      active: true,
    });

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error('Error creating agent offer:', error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
