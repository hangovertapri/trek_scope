import InquiryForm from '@/components/forms/inquiry-form'

export const metadata = {
  title: 'Inquiry',
  description: 'Send an inquiry about a trek',
}

export default function InquiryPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">Send an Inquiry</h1>
        <p className="text-sm text-muted-foreground mb-6">Tell us which trek you&apos;re interested in and a little about your plans.</p>
        <InquiryForm />
      </div>
    </main>
  )
}
