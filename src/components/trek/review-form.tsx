'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Review } from './reviews-list';

interface ReviewFormProps {
  trekId: string;
  trekName: string;
  onReviewSubmitted?: (review: Review) => void;
}

export default function ReviewForm({ trekId, trekName, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!userEmail.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a review title');
      return;
    }
    if (!comment.trim()) {
      setError('Please enter your review');
      return;
    }

    setLoading(true);

    // Create review object
    const newReview: Review = {
      id: `review_${Date.now()}`,
      trekId,
      userName,
      userEmail,
      rating,
      title,
      comment,
      date: new Date().toISOString(),
      verified,
      helpful: 0,
    };

    // Save to localStorage
    try {
      const existingReviews = localStorage.getItem(`reviews_${trekId}`);
      const reviews = existingReviews ? JSON.parse(existingReviews) : [];
      reviews.push(newReview);
      localStorage.setItem(`reviews_${trekId}`, JSON.stringify(reviews));

      setSubmitted(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }

      // Reset form
      setTimeout(() => {
        setRating(5);
        setTitle('');
        setComment('');
        setUserName('');
        setUserEmail('');
        setVerified(false);
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      setError('Failed to save review. Please try again.');
      console.error('Review save error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 bg-slate-800 border border-amber-500 rounded-lg text-center">
        <h3 className="text-lg font-bold text-amber-400 mb-2">✓ Thank You!</h3>
        <p className="text-slate-300">Your review has been posted successfully.</p>
        <p className="text-sm text-slate-400 mt-2">Other trekkers will find it helpful!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 p-6 border border-slate-700 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-amber-400">Share Your Experience</h3>

      {error && (
        <div className="mb-6 p-4 bg-slate-800 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-100 mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-600 hover:text-amber-300'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {rating === 1 && "Poor - Wouldn't recommend"}
          {rating === 2 && "Fair - Some issues"}
          {rating === 3 && 'Good - Decent experience'}
          {rating === 4 && 'Great - Highly satisfied'}
          {rating === 5 && 'Excellent - Outstanding!'}
        </p>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-semibold text-slate-100 mb-2">
          Review Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Amazing views, well-organized trek"
          maxLength={100}
          className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <p className="text-xs text-slate-400 mt-1">{title.length}/100</p>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-semibold text-slate-100 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience - What did you love? What could be improved?"
          maxLength={1000}
          rows={5}
          className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">{comment.length}/1000</p>
      </div>

      {/* Name */}
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-semibold text-slate-100 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your first and last name"
          className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-semibold text-slate-100 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Verified Checkbox */}
      <div className="mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={verified}
            onChange={(e) => setVerified(e.target.checked)}
            className="w-4 h-4 border-slate-700 rounded bg-slate-800"
          />
          <span className="text-sm text-slate-300">
            I have actually completed this trek
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50"
        size="lg"
      >
        {loading ? 'Posting Review...' : 'Post Review'}
      </Button>

      {/* Guidelines */}
      <div className="mt-6 p-4 bg-slate-800 rounded-lg text-sm text-slate-300 border border-slate-700">
        <p className="font-semibold mb-2 text-amber-400">Review Guidelines:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Be honest and constructive</li>
          <li>Focus on your actual experience</li>
          <li>Respect other trekkers and guides</li>
          <li>No spam, promotional content, or offensive language</li>
        </ul>
      </div>
    </form>
  );
}
