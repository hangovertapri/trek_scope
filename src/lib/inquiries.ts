import { promises as fs } from 'fs';
import path from 'path';

export interface Inquiry {
  id: string;
  trek: string;
  trekName: string;
  agencyId?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'responded';
}

export interface BookingRequest {
  id: string;
  trek: string;
  trekName: string;
  agencyId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dates: { start: string; end: string };
  groupSize: number;
  specialRequests: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
}

let inquiries: Inquiry[] = [];
let bookings: BookingRequest[] = [];

const inquiriesFilePath = path.join(process.cwd(), 'src', 'lib', 'inquiries.json');
const bookingsFilePath = path.join(process.cwd(), 'src', 'lib', 'bookings.json');

// Load inquiries from file on startup
async function loadInquiries() {
  try {
    const data = await fs.readFile(inquiriesFilePath, 'utf-8');
    inquiries = JSON.parse(data);
  } catch (error) {
    inquiries = [];
  }
}

// Load bookings from file on startup
async function loadBookings() {
  try {
    const data = await fs.readFile(bookingsFilePath, 'utf-8');
    bookings = JSON.parse(data);
  } catch (error) {
    bookings = [];
  }
}

// Initialize on module load
loadInquiries().catch(console.error);
loadBookings().catch(console.error);

// Persist inquiries to file
async function persistInquiries() {
  try {
    await fs.writeFile(inquiriesFilePath, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to persist inquiries:', error);
  }
}

// Persist bookings to file
async function persistBookings() {
  try {
    await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to persist bookings:', error);
  }
}

// Inquiry functions
export async function addInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> {
  const newInquiry: Inquiry = {
    id: Date.now().toString(),
    ...inquiry,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  inquiries.push(newInquiry);
  await persistInquiries();
  return newInquiry;
}

export function getInquiriesByAgency(agencyId: string): Inquiry[] {
  return inquiries.filter(i => i.agencyId === agencyId);
}

export function getAllInquiries(): Inquiry[] {
  return inquiries;
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry | undefined> {
  const inquiry = inquiries.find(i => i.id === id);
  if (!inquiry) return undefined;
  inquiry.status = status;
  await persistInquiries();
  return inquiry;
}

// Booking functions
export async function addBooking(booking: Omit<BookingRequest, 'id' | 'createdAt'>): Promise<BookingRequest> {
  const newBooking: BookingRequest = {
    id: Date.now().toString(),
    ...booking,
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  await persistBookings();
  return newBooking;
}

export function getBookingsByAgency(agencyId: string): BookingRequest[] {
  return bookings.filter(b => b.agencyId === agencyId);
}

export function getAllBookings(): BookingRequest[] {
  return bookings;
}

export async function updateBookingStatus(id: string, status: BookingRequest['status']): Promise<BookingRequest | undefined> {
  const booking = bookings.find(b => b.id === id);
  if (!booking) return undefined;
  booking.status = status;
  await persistBookings();
  return booking;
}
