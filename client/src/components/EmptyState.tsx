import React from 'react';
import { LucideIcon, FolderGit2 } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderGit2,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-10 md:p-14 text-center rounded-2xl border border-slate-200 bg-white/70 shadow-sm ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 border border-slate-200">
        <Icon className="w-7 h-7 text-[#101B33]" />
      </div>
      <h3 className="text-lg font-semibold text-[#101B33] mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md text-sm leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#101B33] text-white hover:bg-[#1C2C4E] transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
