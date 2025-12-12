import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string; // Classes for the container div
  imageClassName?: string; // Classes specifically for the img tag
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  imageClassName = "",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setCurrentSrc(src);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-tech-card/50 ${className}`}>
      {/* Skeleton / Loading State */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-tech-border/30 animate-pulse z-10 flex items-center justify-center">
             {/* Optional: Add a subtle icon or just keep it as a shimmer */}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="absolute inset-0 bg-tech-card flex flex-col items-center justify-center text-slate-500 z-20">
            <ImageOff size={24} className="mb-2 opacity-50" />
            <span className="text-[10px]">Failed to load</span>
        </div>
      )}
      
      {/* Actual Image */}
      <img 
        src={currentSrc} 
        alt={alt}
        className={`w-full h-full ${imageClassName} transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
};