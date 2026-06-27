import { useMemo } from 'react';
import { useT } from '@/i18n/useTranslation';

interface PercentDisplayProps {
  stdout: string;
}

interface PercentResult {
  percentage: number;
  fraction?: { numerator: number; denominator: number };
}

function parsePercent(stdout: string): PercentResult | null {
  // Try patterns: "84.64% (711/840)" or "Success: 84.64%" or "Rate: 84.64%"
  const patterns = [
    /(\d+\.?\d*)\s*%\s*\(\s*(\d+)\s*\/\s*(\d+)\s*\)/i,
    /(?:success|rate)\s*[:=]\s*(\d+\.?\d*)\s*%/i,
    /(\d+\.?\d*)\s*%/i,
  ];

  for (const pattern of patterns) {
    const match = stdout.match(pattern);
    if (match) {
      const percentage = parseFloat(match[1]);
      const numerator = match[2] ? parseInt(match[2]) : undefined;
      const denominator = match[3] ? parseInt(match[3]) : undefined;
      return {
        percentage,
        fraction: numerator !== undefined && denominator !== undefined
          ? { numerator, denominator }
          : undefined,
      };
    }
  }

  return null;
}

export default function PercentDisplay({ stdout }: PercentDisplayProps) {
  const t = useT();
  const result = useMemo(() => parsePercent(stdout), [stdout]);

  if (!result) {
    return (
      <div className="text-sm text-muted-foreground">
        Raw output:
        <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{stdout}</pre>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (result.percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Ring chart */}
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth="10"
          />
          {/* Progress ring */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold tabular-nums">{result.percentage.toFixed(1)}%</span>
        </div>
      </div>

      {/* Fraction */}
      {result.fraction && (
        <div className="text-sm text-muted-foreground">
          <span className="font-mono">{result.fraction.numerator}</span>
          {' / '}
          <span className="font-mono">{result.fraction.denominator}</span>
          {' '}{t('percent.sequences')}
        </div>
      )}

      {/* Color-coded assessment */}
      <div className={`text-sm font-medium ${
        result.percentage >= 90 ? 'text-green-400' :
        result.percentage >= 70 ? 'text-yellow-400' :
        'text-red-400'
      }`}>
        {result.percentage >= 99 ? t('percent.nearGuaranteed') :
         result.percentage >= 90 ? t('percent.highlyConsistent') :
         result.percentage >= 70 ? t('percent.reliable') :
         result.percentage >= 50 ? t('percent.inconsistent') :
         t('percent.unreliable')}
      </div>
    </div>
  );
}
