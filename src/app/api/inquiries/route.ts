import { NextResponse } from 'next/server'
import { addInquiry, getAllInquiries } from '@/lib/inquiries'
import { getAllTreks } from '@/lib/data'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { trek, trekName, name, email, phone, message } = body
    
    // Find the trek to get the agencyId
    const allTreks = getAllTreks()
    const trekData = allTreks.find((t: any) => t.slug === trek)
    
    // If trek has no agencyId, assign it to the first agency (agency-1)
    // This handles backward compatibility for treks created before agency system
    const agencyId = trekData?.agencyId || 'agency-1'
    
    const inquiry = await addInquiry({
      trek,
      trekName,
      agencyId,
      name,
      email,
      phone,
      message,
    })
    
    console.log('New inquiry received:', inquiry)
    return NextResponse.json({ success: true, inquiry }, { status: 201 })
  } catch (err) {
    console.error('Inquiry API error', err)
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json(getAllInquiries())
}
