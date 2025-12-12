'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dumbbell,
  Mountain,
  AlertCircle,
  Zap,
  Brain,
  CheckCircle2,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: {
    text: string;
    score: number;
    icon?: React.ReactNode;
  }[];
}

interface UserProfile {
  fitnessLevel: number;
  altitudeExperience: number;
  availableTime: number;
  physicalLimitations: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'Fitness Level',
    question: 'How would you describe your current fitness level?',
    options: [
      { text: 'Beginner - I exercise occasionally', score: 1, icon: '🚶' },
      { text: 'Intermediate - I exercise 2-3 times weekly', score: 2, icon: '🏃' },
      {
        text: 'Advanced - I exercise regularly (4+ times weekly)',
        score: 3,
        icon: '💪',
      },
      {
        text: 'Expert - I do endurance sports regularly',
        score: 4,
        icon: '🏔️',
      },
    ],
  },
  {
    id: 2,
    category: 'Altitude Experience',
    question: 'Have you trekked at high altitude before (above 3000m)?',
    options: [
      {
        text: 'No, this would be my first high-altitude trek',
        score: 0,
        icon: '❌',
      },
      {
        text: 'Yes, I have done treks between 3000-4000m',
        score: 1,
        icon: '⬆️',
      },
      {
        text: 'Yes, I have done treks between 4000-5000m',
        score: 2,
        icon: '⬆️⬆️',
      },
      {
        text: 'Yes, I have done treks above 5000m',
        score: 3,
        icon: '🏔️🏔️',
      },
    ],
  },
  {
    id: 3,
    category: 'Available Time',
    question: 'How many days can you dedicate to trekking?',
    options: [
      { text: '3-5 days', score: 0, icon: '📅' },
      { text: '6-10 days', score: 1, icon: '📅📅' },
      { text: '11-15 days', score: 2, icon: '📅📅📅' },
      { text: '15+ days', score: 3, icon: '📅📅📅📅' },
    ],
  },
  {
    id: 4,
    category: 'Physical Limitations',
    question: 'Do you have any physical limitations we should consider?',
    options: [
      {
        text: 'No limitations - I can trek any terrain',
        score: 0,
        icon: '✅',
      },
      {
        text: 'Minor issues (knee pain, asthma) - manageable with preparation',
        score: 1,
        icon: '⚠️',
      },
      {
        text: 'Moderate issues - requires careful pacing',
        score: 2,
        icon: '⚠️⚠️',
      },
      {
        text: 'Significant issues - requires special considerations',
        score: 3,
        icon: '⚠️⚠️⚠️',
      },
    ],
  },
];

interface RecommendationResult {
  level: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  score: number;
  description: string;
  recommendations: string[];
  warnings: string[];
  tips: string[];
}

export default function DifficultyAssessmentTool() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fitnessLevel: 0,
    altitudeExperience: 0,
    availableTime: 0,
    physicalLimitations: 0,
  });

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    // Update user profile based on category
    const category = quizQuestions[currentQuestion].category;
    const updatedProfile = { ...userProfile };

    if (category === 'Fitness Level') updatedProfile.fitnessLevel = score;
    if (category === 'Altitude Experience') updatedProfile.altitudeExperience = score;
    if (category === 'Available Time') updatedProfile.availableTime = score;
    if (category === 'Physical Limitations') updatedProfile.physicalLimitations = score;

    setUserProfile(updatedProfile);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateRecommendation = (): RecommendationResult => {
    // Calculate total score (max 12)
    const totalScore =
      userProfile.fitnessLevel +
      userProfile.altitudeExperience +
      userProfile.availableTime -
      userProfile.physicalLimitations;

    const normalizedScore = Math.max(0, Math.min(12, totalScore));

    if (normalizedScore >= 11) {
      return {
        level: 'Expert',
        score: normalizedScore,
        description:
          'You are ready for challenging, high-altitude treks with technical terrain.',
        recommendations: [
          'Everest Base Camp (5,364m)',
          'Three Passes Trek (5,370m)',
          'Manaslu Circuit (5,160m)',
          'Rolwaling Valley Trek',
        ],
        warnings: [
          'Ensure comprehensive travel insurance with altitude coverage',
          'Acclimatization is critical - follow guides recommendations',
          'Weather can change rapidly at high altitudes',
        ],
        tips: [
          'Train with elevation training masks if possible',
          'Practice altitude acclimatization techniques',
          'Pack for extreme weather conditions',
        ],
      };
    } else if (normalizedScore >= 8) {
      return {
        level: 'Challenging',
        score: normalizedScore,
        description:
          'You can handle challenging treks with significant elevation and technical sections.',
        recommendations: [
          'Gokyo Lakes Trek (5,000m)',
          'Annapurna Base Camp (4,130m)',
          'Langtang Valley Trek (4,600m)',
          'Tamang Heritage Trek',
        ],
        warnings: [
          'Take altitude sickness seriously - ascend slowly',
          'Physical fitness is important for success',
          'Weather can be unpredictable',
        ],
        tips: [
          'Do cardio training before the trek',
          'Arrive early for acclimatization',
          'Listen to your body and rest when needed',
        ],
      };
    } else if (normalizedScore >= 5) {
      return {
        level: 'Moderate',
        score: normalizedScore,
        description:
          'You can handle moderate treks with gradual elevation gain and some challenging sections.',
        recommendations: [
          'Poon Hill Trek (3,210m)',
          'Phakding to Namche Bazaar',
          'Chandra Binayak Trek (3,660m)',
          'Helambu Circuit Trek (3,600m)',
        ],
        warnings: [
          'Start acclimatization at moderate elevations',
          'Stay well-hydrated throughout the trek',
          'Do not rush - gradual pace is important',
        ],
        tips: [
          'Build basic fitness before the trek',
          'Start with shorter altitude gains',
          'Hire a porter if carrying heavy loads',
        ],
      };
    } else {
      return {
        level: 'Easy',
        score: normalizedScore,
        description:
          'You should start with easy treks with low elevation gain and well-established trails.',
        recommendations: [
          'Pikey Peak Trek (2,054m)',
          'Namobuddha Trek (1,877m)',
          'Kakani Trek (2,100m)',
          'Dhulikhel to Namobuddha Trek',
        ],
        warnings: [
          'Even easy treks require basic fitness',
          'Proper footwear is essential',
          'Start early to finish before dark',
        ],
        tips: [
          'Take it slow and enjoy the views',
          'Bring plenty of water and snacks',
          'Consider hiring a guide for safety',
        ],
      };
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setUserProfile({
      fitnessLevel: 0,
      altitudeExperience: 0,
      availableTime: 0,
      physicalLimitations: 0,
    });
  };

  if (showResults) {
    const result = calculateRecommendation();

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Your Trek Profile</h2>
          <p className="text-slate-600">Based on your answers, here's your personalized recommendation</p>
        </div>

        {/* Difficulty Level Badge */}
        <Card className="mb-8 p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 mb-2 uppercase">
                Recommended Trek Difficulty
              </h3>
              <div className="flex items-center gap-3">
                <div className={`px-6 py-2 rounded-full font-bold text-lg ${getDifficultyColor(result.level)}`}>
                  {result.level}
                </div>
                <div className="text-sm text-slate-600">
                  Score: {Math.round(result.score * 10) / 10} / 12
                </div>
              </div>
            </div>
            {getDifficultyIcon(result.level)}
          </div>
          <p className="text-slate-700 mt-4 text-lg">{result.description}</p>
        </Card>

        {/* Recommended Treks */}
        <Card className="mb-8 p-6 border-l-4 border-l-blue-500">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Recommended Treks for You
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.recommendations.map((trek, idx) => (
              <div
                key={idx}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
              >
                <p className="font-semibold text-slate-900">{trek}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tips */}
          <Card className="p-6 border-l-4 border-l-green-500">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-amber-400" />
              Preparation Tips
            </h4>
            <ul className="space-y-2">
              {result.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span className="text-slate-700">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Warnings */}
          <Card className="p-6 border-l-4 border-l-orange-500">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Important Warnings
            </h4>
            <ul className="space-y-2">
              {result.warnings.map((warning, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-orange-600 font-bold">!</span>
                  <span className="text-slate-700">{warning}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={resetQuiz} variant="outline" size="lg">
            Take Quiz Again
          </Button>
          <Button asChild size="lg">
            <a href="/treks">Browse All Treks</a>
          </Button>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Trek Difficulty Quiz</h2>
        <p className="text-slate-600">
          Answer a few questions to get personalized trek recommendations
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-600">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm font-semibold text-slate-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8 mb-8">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            {question.category}
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{question.question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.score)}
              className="w-full p-4 text-left border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-3 group"
            >
              <span className="text-2xl group-hover:scale-125 transition">
                {option.icon || '○'}
              </span>
              <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                {option.text}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function getDifficultyColor(level: string): string {
  switch (level) {
    case 'Easy':
      return 'bg-amber-100 text-amber-900';
    case 'Moderate':
      return 'bg-accent/20 text-accent';
    case 'Challenging':
      return 'bg-orange-100 text-orange-900';
    case 'Expert':
      return 'bg-red-100 text-red-900';
    default:
      return 'bg-gray-100 text-gray-900';
  }
}

function getDifficultyIcon(level: string) {
  switch (level) {
    case 'Easy':
      return <Mountain className="h-12 w-12 text-amber-400" />;
    case 'Moderate':
      return <Mountain className="h-12 w-12 text-yellow-600" />;
    case 'Challenging':
      return <Dumbbell className="h-12 w-12 text-orange-600" />;
    case 'Expert':
      return <Zap className="h-12 w-12 text-red-600" />;
    default:
      return <Mountain className="h-12 w-12 text-gray-600" />;
  }
}
