import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load data',
  description = 'We encountered an error while fetching the requested information. Please try again.',
  onRetry,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-red-200 ${className}`}>
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-3">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 max-w-md mb-4">{description}</p>
    {onRetry && (
      <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);
