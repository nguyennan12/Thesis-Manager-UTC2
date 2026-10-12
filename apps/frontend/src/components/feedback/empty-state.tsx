import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-utc2-border bg-white p-8 text-center',
        className,
      )}
    >
      <h3 className="text-sm font-semibold text-utc2-text-main">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-xs text-utc2-text-muted">{description}</p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          className="mt-4 text-xs font-semibold text-white bg-[#0f62fe] hover:bg-[#0043ce] px-3.5 py-1.5 rounded transition-colors"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
