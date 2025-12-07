import RecommendationForm from '@/components/forms/recommendation-form';

export default function RecommendPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          Smart Trek Finder
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Let our AI help you find the perfect trek. Tell us what you're
          looking for, and we'll provide personalized recommendations.
        </p>
      </div>
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <RecommendationForm />
      </div>
    </div>
  );
}
