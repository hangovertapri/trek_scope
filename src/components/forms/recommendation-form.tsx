'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getTrekRecommendation } from '@/lib/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import { difficulties } from '@/lib/data';

type ActionState = {
  errors?: Record<string, string[]>;
  recommendations?: Array<{ 
    id?: string;
    trekName: string; 
    region: string; 
    difficulty: string; 
    duration: string; 
    description: string;
    matchReason?: string;
    priceRange?: number[];
  }>;
  message?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding Treks...
        </>
      ) : (
        'Get Recommendations'
      )}
    </Button>
  );
}

export default function RecommendationForm() {
  const initialState: ActionState = {};
  const [state, dispatch] = useActionState(getTrekRecommendation, initialState);

  return (
    <>
      <form action={dispatch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="preferredRegion">Preferred Region</Label>
            <Input
              id="preferredRegion"
              name="preferredRegion"
              placeholder="e.g., Annapurna, Nepal"
            />
            {state?.errors?.preferredRegion && (
              <p className="text-sm text-destructive mt-1">
                {state.errors.preferredRegion[0]}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="desiredDifficultyLevel">Difficulty Level</Label>
            <Select name="desiredDifficultyLevel">
              <SelectTrigger>
                <SelectValue placeholder="Select a difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.desiredDifficultyLevel && (
              <p className="text-sm text-destructive mt-1">
                {state.errors.desiredDifficultyLevel[0]}
              </p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="idealTravelDates">Ideal Travel Dates</Label>
          <Input
            id="idealTravelDates"
            name="idealTravelDates"
            placeholder="e.g., October 2024"
          />
          {state?.errors?.idealTravelDates && (
            <p className="text-sm text-destructive mt-1">
              {state.errors.idealTravelDates[0]}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="otherPreferences">Other Preferences</Label>
          <Textarea
            id="otherPreferences"
            name="otherPreferences"
            placeholder="e.g., Less crowded, great views, interested in culture..."
          />
        </div>

        {state?.errors?._form && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.errors._form[0]}</AlertDescription>
          </Alert>
        )}
        <SubmitButton />
      </form>

      {state?.recommendations && state.recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold font-headline text-primary mb-6">
            Your Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.recommendations.map((trek: any, index: number) => (
              <div key={trek.id || index} className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg font-headline text-foreground">{trek.trekName}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{trek.region}</p>
                  </div>
                  
                  <div className="flex gap-2 text-xs">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                      {trek.difficulty}
                    </span>
                    <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                      {trek.duration}
                    </span>
                  </div>

                  <p className="text-sm text-foreground/80 line-clamp-3">{trek.description}</p>

                  {trek.matchReason && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                      ✓ {trek.matchReason}
                    </p>
                  )}

                  {trek.priceRange && trek.priceRange.length >= 2 && (
                    <p className="text-xs font-semibold text-muted-foreground">
                      ${trek.priceRange[0]} - ${trek.priceRange[1]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {state?.message && !state.recommendations && (
        <div className="mt-12 p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">{state.message}</p>
        </div>
      )}
    </>
  );
}
