import React from 'react';
import { HeroData, SocialLink } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface HeroProps {
  data: HeroData;
  socials: SocialLink[];
}

export const Hero: React.FC<HeroProps> = ({ data, socials }) => {
  return (
    <section className="relative pt-12 pb-8 px-4 flex flex-col items-center text-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-tech-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 mb-6">
        <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-tech-primary to-tech-accent mx-auto mb-4">
          <div className="w-full h-full rounded-full overflow-hidden bg-tech-bg border-4 border-tech-bg relative">
            <OptimizedImage 
              src={data.avatarUrl} 
              alt={data.name} 
              className="w-full h-full"
              imageClassName="object-cover"
            />
          </div>
        </div>
        
        {data.status && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-border/50 border border-tech-border text-xs text-tech-primary mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-tech-primary animate-pulse"></span>
            {data.status}
          </div>
        )}
        
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
          {data.name}
        </h1>
        <p className="text-tech-primary font-mono text-sm uppercase tracking-wider mb-4 opacity-90">
          {data.title}
        </p>
        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
          {data.bio}
        </p>
      </div>

      <div className="flex gap-4 z-10 flex-wrap justify-center">
        {socials.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-tech-card border border-tech-border text-slate-400 hover:text-white hover:border-tech-primary/50 hover:bg-tech-border transition-all duration-300"
            aria-label={social.platform}
            title={social.platform}
          >
            <social.icon size={20} />
          </a>
        ))}
      </div>
    </section>
  );
};