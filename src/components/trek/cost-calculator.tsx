'use client';

import { useState } from 'react';
import { DollarSign, Plane, Backpack, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CostBreakdown {
  trekPrice: number;
  flights: number;
  equipment: number;
  insurance: number;
  contingency: number;
  total: number;
}

interface CostCalculatorProps {
  trekPrice: [number, number]; // [min, max]
  trekName: string;
}

export default function CostCalculator({ trekPrice, trekName }: CostCalculatorProps) {
  const [costs, setCosts] = useState<CostBreakdown>({
    trekPrice: (trekPrice[0] + trekPrice[1]) / 2,
    flights: 1200,
    equipment: 500,
    insurance: 150,
    contingency: 300,
    total: 0,
  });

  const [expanded, setExpanded] = useState(false);

  // Calculate total whenever costs change
  const calculateTotal = (newCosts: Partial<CostBreakdown>) => {
    const updated = { ...costs, ...newCosts };
    updated.total =
      updated.trekPrice +
      updated.flights +
      updated.equipment +
      updated.insurance +
      updated.contingency;
    setCosts(updated);
  };

  const handleCostChange = (field: keyof CostBreakdown, value: number) => {
    calculateTotal({ [field]: value });
  };

  const costItems = [
    {
      label: 'Trek Price',
      value: costs.trekPrice,
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Agency fee for trek services',
      min: trekPrice[0],
      max: trekPrice[1],
      field: 'trekPrice' as const,
      color: 'bg-blue-100 text-blue-900',
      borderColor: 'border-blue-300',
    },
    {
      label: 'Flights',
      value: costs.flights,
      icon: <Plane className="h-5 w-5" />,
      description: 'Round-trip international flights (estimated)',
      min: 0,
      max: 3000,
      field: 'flights' as const,
      color: 'bg-purple-100 text-purple-900',
      borderColor: 'border-purple-300',
    },
    {
      label: 'Equipment & Gear',
      value: costs.equipment,
      icon: <Backpack className="h-5 w-5" />,
      description: 'New gear, rentals, or purchases',
      min: 0,
      max: 2000,
      field: 'equipment' as const,
      color: 'bg-amber-100 text-amber-900',
      borderColor: 'border-amber-300',
    },
    {
      label: 'Travel Insurance',
      value: costs.insurance,
      icon: <Heart className="h-5 w-5" />,
      description: 'Comprehensive travel & altitude insurance',
      min: 0,
      max: 800,
      field: 'insurance' as const,
      color: 'bg-red-100 text-red-900',
      borderColor: 'border-red-300',
    },
  ];

  const percentages = {
    trekPrice: ((costs.trekPrice / costs.total) * 100).toFixed(0),
    flights: ((costs.flights / costs.total) * 100).toFixed(0),
    equipment: ((costs.equipment / costs.total) * 100).toFixed(0),
    insurance: ((costs.insurance / costs.total) * 100).toFixed(0),
    contingency: ((costs.contingency / costs.total) * 100).toFixed(0),
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2 mb-2 text-amber-400">
          <DollarSign className="h-6 w-6" />
          Trek Cost Calculator
        </h3>
        <p className="text-sm text-slate-300">
          Estimate your total budget for {trekName}
        </p>
      </div>

      {/* Total Cost Display */}
      <div className="mb-8 p-6 bg-gradient-to-r from-slate-800 to-slate-900 border border-amber-500 text-white rounded-lg">
        <p className="text-sm font-semibold text-amber-400 mb-2">Total Estimated Cost</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-bold">${costs.total.toLocaleString()}</span>
          <span className="text-amber-300">USD</span>
        </div>
        <p className="text-sm text-slate-300">
          This includes trek price, flights, equipment, insurance, and contingency buffer
        </p>
      </div>

      {/* Cost Breakdown Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mb-6 p-4 bg-slate-800 border-2 border-slate-700 rounded-lg hover:border-amber-500 transition text-left font-semibold text-slate-100"
      >
        {expanded ? '▼' : '▶'} Detailed Cost Breakdown
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-6 mb-8">
          {costItems.map((item) => (
            <div
              key={item.field}
              className={`border-l-4 ${item.borderColor} p-4 bg-slate-800 rounded-lg border border-slate-700`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.color}`}>{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-100">{item.label}</h4>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-amber-400">
                  ${item.value.toLocaleString()}
                </span>
              </div>

              {/* Input Range */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  value={item.value}
                  onChange={(e) => handleCostChange(item.field, Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                      ((item.value - item.min) / (item.max - item.min)) * 100
                    }%, #374151 ${
                      ((item.value - item.min) / (item.max - item.min)) * 100
                    }%, #374151 100%)`,
                  }}
                />
              </div>

              {/* Min/Max Labels */}
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>${item.min.toLocaleString()}</span>
                <span>${item.max.toLocaleString()}</span>
              </div>

              {/* Percentage */}
              <div className="mt-3 text-sm font-semibold text-amber-400">
                {percentages[item.field]}% of total
              </div>
            </div>
          ))}

          {/* Contingency */}
          <div className="border-l-4 border-accent p-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-slate-100">Contingency Buffer</h4>
                <p className="text-xs text-slate-400">
                  Emergency fund for unexpected expenses (15% of base cost)
                </p>
              </div>
              <span className="text-2xl font-bold text-amber-400">
                ${costs.contingency.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-amber-400">
              {percentages.contingency}% of total (Auto-calculated)
            </div>
          </div>
        </div>
      )}

      {/* Summary Chart */}
      <div className="mb-8">
        <h4 className="font-semibold text-slate-100 mb-4">Cost Distribution</h4>
        <div className="space-y-3">
          {[
            {
              label: 'Trek Price',
              value: costs.trekPrice,
              percentage: percentages.trekPrice,
              color: 'bg-amber-500',
            },
            {
              label: 'Flights',
              value: costs.flights,
              percentage: percentages.flights,
              color: 'bg-cyan-500',
            },
            {
              label: 'Equipment',
              value: costs.equipment,
              percentage: percentages.equipment,
              color: 'bg-amber-500',
            },
            {
              label: 'Insurance',
              value: costs.insurance,
              percentage: percentages.insurance,
              color: 'bg-red-500',
            },
            {
              label: 'Contingency',
              value: costs.contingency,
              percentage: percentages.contingency,
              color: 'bg-amber-500',
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium text-slate-300">{item.label}</span>
                <span className="font-semibold text-amber-400">
                  ${item.value.toLocaleString()} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-300`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips & Recommendations */}
      <div className="bg-slate-800 border border-amber-500 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-amber-400 mb-3">💡 Money Saving Tips</h4>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>✓ Book flights 2-3 months in advance for better rates</li>
          <li>✓ Consider travel insurance bundles for discounts</li>
          <li>✓ Rent gear locally instead of buying new equipment</li>
          <li>✓ Join group treks for better pricing</li>
          <li>✓ Travel during shoulder season (Sept-Oct, April-May) for discounts</li>
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => window.print()}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          📄 Print Budget
        </Button>
        <Button asChild className="flex-1 bg-accent hover:bg-accent/90" size="lg">
          <a href="/inquiry">Get Detailed Quote</a>
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-6 border-t border-slate-700 text-xs text-slate-400">
        <p>
          💬 <strong>Note:</strong> Prices are estimates based on average market rates. Actual
          costs may vary based on season, group size, and individual choices. Contact trek
          operators for accurate quotes.
        </p>
      </div>
    </div>
  );
}
