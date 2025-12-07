import { NextResponse } from 'next/server'
import { promises as fs } from 'fs';
import path from 'path';
import { getAllTreks } from '@/lib/data'

const messagesFilePath = path.join(process.cwd(), 'src', 'lib', 'messages.json');

interface Message {
  id: string;
  trek: string;
  trekName: string;
  agencyId?: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

let messages: Message[] = [];

// Load messages on startup
async function loadMessages() {
  try {
    const data = await fs.readFile(messagesFilePath, 'utf-8');
    messages = JSON.parse(data);
  } catch (error) {
    messages = [];
  }
}

loadMessages().catch(console.error);

async function persistMessages() {
  try {
    await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to persist messages:', error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { trek, trekName, name, email, message: messageText } = body
    
    // Find the trek to get the agencyId
    const allTreks = getAllTreks()
    const trekData = allTreks.find((t: any) => t.slug === trek)
    
    // If trek has no agencyId, assign it to the first agency (agency-1)
    const agencyId = trekData?.agencyId || 'agency-1'
    
    const message: Message = {
      id: Date.now().toString(),
      trek,
      trekName,
      agencyId,
      name,
      email,
      message: messageText,
      createdAt: new Date().toISOString(),
      read: false,
    }
    
    messages.push(message)
    await persistMessages()
    
    console.log('New message received:', message)
    return NextResponse.json({ success: true, message }, { status: 201 })
  } catch (err) {
    console.error('Message API error', err)
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json(messages)
}

export async function PUT(req: Request) {
  try {
    const { id, read } = await req.json()
    const message = messages.find(m => m.id === id)
    
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    
    message.read = read
    await persistMessages()
    
    return NextResponse.json(message)
  } catch (err) {
    console.error('Message update error', err)
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}
