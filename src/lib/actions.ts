'use server';

import { z } from 'zod';
import { recommendTrek } from '@/ai/flows/smart-trek-recommendation';
import type { RecommendTrekOutput } from '@/ai/flows/smart-trek-recommendation';

const inquirySchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().optional(),
  trekName: z.string(),
  preferredDates: z.string().min(1, 'Preferred dates are required.'),
  groupSize: z.coerce.number().min(1, 'Group size must be at least 1.'),
  notes: z.string().optional(),
});

export async function submitInquiry(prevState: any, formData: FormData) {
  const validatedFields = inquirySchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }

  const data = validatedFields.data;

  // Here you would typically save to Firestore and send an email notification.
  // For now, we'll just log it to the console.
  console.log('New Inquiry Submitted:', data);

  return {
    message: 'Your inquiry has been submitted successfully!',
    errors: {},
    success: true,
  };
}

const recommendationSchema = z.object({
  preferredRegion: z.string().min(1, 'Preferred region is required.'),
  desiredDifficultyLevel: z.string().min(1, 'Difficulty level is required.'),
  idealTravelDates: z.string().min(1, 'Travel dates are required.'),
  otherPreferences: z.string().optional(),
});

export type RecommendationFormState = {
  message?: string;
  errors?: {
    preferredRegion?: string[];
    desiredDifficultyLevel?: string[];
    idealTravelDates?: string[];
    otherPreferences?: string[];
    _form?: string[];
  };
  recommendations?: RecommendTrekOutput['trekRecommendations'];
};

export async function getTrekRecommendation(
  prevState: RecommendationFormState,
  formData: FormData
): Promise<RecommendationFormState> {
  try {
    const validatedFields = recommendationSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const result = await recommendTrek(validatedFields.data);

    if (!result || result.trekRecommendations.length === 0) {
      return {
        message:
          "We couldn't find any treks matching your criteria. Please try adjusting your preferences.",
      };
    }

    return { recommendations: result.trekRecommendations };
  } catch (error) {
    console.error('Error getting trek recommendation:', error);
    return {
      errors: {
        _form: [
          'An unexpected error occurred. Please try again later.',
        ],
      },
    };
  }
}
