import { NextResponse } from 'next/server'
import { addBooking, getAllBookings, updateBookingStatus } from '@/lib/inquiries'
import { getAllTreks } from '@/lib/data'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { trek, trekName, customerName, customerEmail, customerPhone, dates, groupSize, specialRequests } = body
    
    // Find the trek to get the agencyId
    const allTreks = getAllTreks()
    const trekData = allTreks.find((t: any) => t.slug === trek)
    
    // If trek has no agencyId, assign it to the first agency (agency-1)
    // This handles backward compatibility for treks created before agency system
    const agencyId = trekData?.agencyId || 'agency-1'
    
    const booking = await addBooking({
      trek,
      trekName,
      agencyId,
      customerName,
      customerEmail,
      customerPhone,
      dates,
      groupSize,
      specialRequests,
      status: 'pending',
    })
    
    console.log('New booking received:', booking)
    return NextResponse.json({ success: true, booking }, { status: 201 })
  } catch (err) {
    console.error('Booking API error', err)
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json(getAllBookings())
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json()
    const booking = await updateBookingStatus(id, status)
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    return NextResponse.json(booking)
  } catch (err) {
    console.error('Booking update error', err)
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}
