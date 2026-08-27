import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string; // Tailwind stroke color or hex
  trackColor?: string;
  textColor?: string;
  subText?: string;
  children?: React.ReactNode;
  glow?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 80,
  strokeWidth = 3.5,
  color = '#ffeb3b',
  trackColor = '#221a42',
  textColor = '#ffffff',
  subText,
  children,
  glow = true,
}) => {
  const radius = 15.9155; // standard viewBox 36x36 circumference = 100
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        className="w-full h-full -rotate-90 transform"
        viewBox="0 0 36 36"
      >
        {/* Background Track */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Filled Arc */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${normalizedPercentage}, 100`}
          strokeLinecap="round"
          style={
            glow
              ? {
                  filter: `drop-shadow(0 0 4px ${color})`,
                  transition: 'stroke-dasharray 0.8s ease-in-out',
                }
              : { transition: 'stroke-dasharray 0.8s ease-in-out' }
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {children ? (
          children
        ) : (
          <>
            <span
              className="font-bold tracking-tight leading-none"
              style={{
                color: textColor,
                fontSize: size >= 70 ? '1.25rem' : '0.75rem',
              }}
            >
              {Math.round(percentage)}%
            </span>
            {subText && (
              <span className="text-[9px] text-purple-200/70 mt-0.5 font-medium">
                {subText}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
