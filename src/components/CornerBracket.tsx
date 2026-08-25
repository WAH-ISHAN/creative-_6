import React from 'react';

interface CornerBracketProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  thickness?: number;
  color?: string;
  className?: string;
}

export const CornerBracket: React.FC<CornerBracketProps> = ({
  position,
  size = 18,
  thickness = 1.5,
  color = '#050505',
  className = ''
}) => {
  const getBorderClasses = () => {
    switch (position) {
      case 'top-left':
        return 'border-t border-l';
      case 'top-right':
        return 'border-t border-r';
      case 'bottom-left':
        return 'border-b border-l';
      case 'bottom-right':
        return 'border-b border-r';
    }
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderColor: color,
        borderWidth: `${thickness}px`,
      }}
      className={`shrink-0 pointer-events-none transition-all duration-300 ${getBorderClasses()} ${className}`}
    />
  );
};

export const FourCornerFrame: React.FC<{
  children: React.ReactNode;
  bracketSize?: number;
  bracketColor?: string;
  thickness?: number;
  className?: string;
  offset?: number;
  id?: string;
}> = ({
  children,
  bracketSize = 18,
  bracketColor = '#050505',
  thickness = 1.5,
  className = '',
  offset = 4,
  id
}) => {
  return (
    <div id={id} className={`relative ${className}`}>
      {/* Top Left */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{ top: `-${offset}px`, left: `-${offset}px` }}
      >
        <CornerBracket position="top-left" size={bracketSize} thickness={thickness} color={bracketColor} />
      </div>
      {/* Top Right */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{ top: `-${offset}px`, right: `-${offset}px` }}
      >
        <CornerBracket position="top-right" size={bracketSize} thickness={thickness} color={bracketColor} />
      </div>
      {/* Bottom Left */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{ bottom: `-${offset}px`, left: `-${offset}px` }}
      >
        <CornerBracket position="bottom-left" size={bracketSize} thickness={thickness} color={bracketColor} />
      </div>
      {/* Bottom Right */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{ bottom: `-${offset}px`, right: `-${offset}px` }}
      >
        <CornerBracket position="bottom-right" size={bracketSize} thickness={thickness} color={bracketColor} />
      </div>
      {children}
    </div>
  );
};
