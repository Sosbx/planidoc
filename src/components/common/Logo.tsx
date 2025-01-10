import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', showText = true }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/Logo.png" 
        alt="PlaniDoc Logo" 
        className="h-8 w-8 object-contain"
      />
      {showText && (
        <h1 className="ml-2 text-xl font-bold text-white">
          PlaniDoc
        </h1>
      )}
    </div>
  );
};

export default Logo;