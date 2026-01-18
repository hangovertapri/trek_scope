'use client';

import { getAllTreks } from '@/lib/data';
import Meta from '@/components/meta';
import dynamic from 'next/dynamic';

// Import map component with no SSR to avoid hydration issues
const SimpleNepalMap = dynamic(
  () => import('@/components/trek/simple-nepal-map').then(mod => ({ default: mod.SimpleNepalMap })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-800 font-medium">Loading Nepal Trek Map...</p>
        </div>
      </div>
    )
  }
);

export default function ExplorePage() {
  const treks = getAllTreks();

  return (
    <>
      <Meta
        title="Explore Treks - Nepal Interactive Map"
        description="Explore all trekking routes in Nepal on our interactive map. View trek locations, difficulty levels, and regions at a glance."
        canonical="/explore"
      />
      
      <div className="w-full h-screen relative bg-gradient-to-br from-slate-50 to-blue-50">
        <SimpleNepalMap treks={treks} />
        
        {/* Page Title */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[5] pointer-events-none">
          <h1 className="text-4xl font-bold text-center tracking-wide text-slate-800 drop-shadow-lg">
            Nepal Trekking Map
          </h1>
        </div>
      </div>
    </>
  );
}
