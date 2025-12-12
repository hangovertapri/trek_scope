'use client';

import { useEffect, useState } from 'react';
import { Star, User, Calendar, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Review {
  id: string;
  trekId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string;
  verified: boolean; // Whether they actually booked
  helpful: number; // Count of helpful votes
}

interface ReviewsListProps {
  trekId: string;
  trekName: string;
}

export default function ReviewsList({ trekId, trekName }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    // Load reviews from localStorage
    const savedReviews = localStorage.getItem(`reviews_${trekId}`);
    if (savedReviews) {
      try {
        const parsed = JSON.parse(savedReviews);
        setReviews(parsed);
      } catch (err) {
        console.error('Error parsing reviews:', err);
      }
    }
    setLoading(false);
  }, [trekId]);

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'helpful') {
      return b.helpful - a.helpful;
    }
    return 0;
  });

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      reviews.length > 0
        ? Math.round((reviews.filter((r) => r.rating === rating).length / reviews.length) * 100)
        : 0,
  }));

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-200 rounded-lg" />;
  }

  return (
    <div className="w-full">
      {/* Reviews Summary */}
      {reviews.length > 0 && (
        <div className="mb-8 p-6 bg-slate-800 border border-slate-700 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-amber-400">Trek Ratings</h3>
              <div className="flex items-start gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-5xl font-bold text-amber-400">
                      {averageRating}
                    </div>
                    <div className="text-slate-400">/ 5</div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(Number(averageRating))
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-amber-400">Rating Breakdown</h3>
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm font-semibold w-12 text-slate-300">{rating} ⭐</span>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sort and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border-2 border-slate-700 rounded-lg text-sm font-medium bg-slate-800 text-slate-100 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>

          {/* Rating Filter */}
          {reviews.length > 0 && (
            <select
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 border-2 border-slate-700 rounded-lg text-sm font-medium bg-slate-800 text-slate-100 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>
          )}
        </div>

        <a href={`#write-review-${trekId}`} className="inline-block px-6 py-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition">
          Write a Review
        </a>
      </div>

      {/* Reviews List */}
      {sortedReviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-400 mb-4">No reviews yet for {trekName}</p>
          <p className="text-sm text-slate-500">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 border border-slate-700 rounded-lg bg-slate-800 hover:border-slate-600 transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="text-xs bg-amber-900 text-amber-200 px-2 py-1 rounded font-semibold">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-100">{review.title}</h4>
                </div>
              </div>

              {/* Reviewer Info */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {review.userName}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-slate-300 mb-4 leading-relaxed">{review.comment}</p>

              {/* Helpful Button */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-slate-400 hover:text-amber-400"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
