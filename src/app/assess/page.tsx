import type { Metadata } from 'next';
import DifficultyAssessmentTool from '@/components/forms/difficulty-assessment-quiz';
import Meta from '@/components/meta';
import AnimateOnScroll from '@/components/shared/animate-on-scroll';

export const metadata: Metadata = {
  title: 'Trek Difficulty Self-Assessment Tool | TrekScope',
  description: 'Take our interactive quiz to find out which trek difficulty level is right for you. Get personalized recommendations based on your fitness and experience.',
  openGraph: {
    title: 'Trek Difficulty Self-Assessment | TrekScope',
    description: 'Discover your perfect trek difficulty level with our interactive assessment tool.',
  },
};

export default function AssessmentPage() {
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/assess`;

  return (
    <article className="animate-fade-in">
      <Meta
        title="Trek Difficulty Assessment Tool"
        description="Find your perfect trek difficulty level with our interactive quiz"
        url={pageUrl}
      />

      {/* Hero Section */}
      <header className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-6">
            Find Your Perfect Trek
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Not sure which trek is right for you? Take our quick self-assessment
            quiz to discover treks that match your fitness level, experience, and
            available time.
          </p>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-12 px-4 bg-white">
        <AnimateOnScroll className="max-w-5xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold font-headline mb-8">
            Why Take This Assessment?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-lg mb-2">Personalized Match</h3>
              <p className="text-slate-600 text-sm">
                Get trek recommendations tailored to your fitness level and experience
              </p>
            </div>
            <div className="p-6 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">Avoid Disappointment</h3>
              <p className="text-slate-600 text-sm">
                Choose treks you can realistically complete and enjoy
              </p>
            </div>
            <div className="p-6 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold text-lg mb-2">Stay Safe</h3>
              <p className="text-slate-600 text-sm">
                Receive important safety tips and warnings for your trek level
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Quiz Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <DifficultyAssessmentTool />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <AnimateOnScroll className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold font-headline mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="p-6 border border-slate-200 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                What if I'm not sure about my fitness level?
              </h3>
              <p className="text-slate-600">
                Be honest with yourself. "Intermediate" means exercising 2-3 times
                per week. If you're not sure, start with a lower level - you can
                always try harder treks later.
              </p>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                Does altitude sickness affect the recommendation?
              </h3>
              <p className="text-slate-600">
                Yes! Your altitude experience is a key factor. If this is your first
                high-altitude trek, we'll recommend starting at lower elevations to
                acclimatize properly.
              </p>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                Can I take the quiz multiple times?
              </h3>
              <p className="text-slate-600">
                Absolutely! As you improve your fitness or gain more experience, you
                can retake the quiz to unlock higher difficulty treks.
              </p>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                Are your recommendations based on real data?
              </h3>
              <p className="text-slate-600">
                Our recommendations are based on industry standards, trekking guide
                expertise, and safety considerations. However, individual experiences
                vary - always consult with trek operators for current conditions.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Trek?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Based on your assessment results, browse and compare treks that match
            your level, then book with one of our trusted partner agencies.
          </p>
          <a
            href="/treks"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
          >
            Browse All Treks
          </a>
        </div>
      </section>
    </article>
  );
}
