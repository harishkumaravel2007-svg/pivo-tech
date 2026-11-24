import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark'; // 'light' is for light backgrounds, 'dark' is for dark navy backgrounds
  symbolOnly?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  symbolOnly = false,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const isLight = variant === 'light';

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* Precision Geometric P Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${
        size === 'sm' ? 'w-8 h-8 rounded-lg' : size === 'lg' ? 'w-12 h-12 rounded-xl' : 'w-10 h-10 rounded-xl'
      } bg-[#101B33] border border-[#C6A15B]/30 shadow-subtle group-hover:border-[#C6A15B] transition-colors`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          <defs>
            <linearGradient id="logoGoldG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5C378" />
              <stop offset="50%" stopColor="#C6A15B" />
              <stop offset="100%" stopColor="#9E7D3B" />
            </linearGradient>
          </defs>
          {/* Stem */}
          <rect x="12" y="10" width="5.5" height="28" rx="2.5" fill="#FFFFFF" />
          {/* Geometric Loop */}
          <path
            d="M17.5 10H27C31.9706 10 36 14.0294 36 19C36 23.9706 31.9706 28 27 28H17.5V22.5H26.5C28.433 22.5 30 20.933 30 19C30 17.067 28.433 15.5 26.5 15.5H17.5V10Z"
            fill="url(#logoGoldG)"
          />
          {/* Tech Automation Core Dot */}
          <circle cx="23.5" cy="19" r="2.2" fill="#FFFFFF" />
          {/* Subtle Accent Wedge */}
          <path d="M12 30L17.5 36V30H12Z" fill="url(#logoGoldG)" opacity="0.95" />
        </svg>
      </div>

      {!symbolOnly && (
        <div className="flex flex-col text-left">
          <div className="flex items-center tracking-tight leading-none">
            <span className={`font-extrabold ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'} ${
              isLight ? 'text-[#101B33]' : 'text-white'
            } tracking-wider`}>
              PIVO
            </span>
            <span className={`ml-1 font-bold ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'} text-[#C6A15B] tracking-wider`}>
              TECH
            </span>
          </div>
          <span className={`text-[9px] font-semibold tracking-[0.22em] uppercase mt-0.5 ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Build. Grow. Automate.
          </span>
        </div>
      )}
    </Link>
  );
};
