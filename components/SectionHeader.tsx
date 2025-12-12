import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8 pl-1">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100 flex items-center gap-2">
        <span className="w-1 h-6 bg-tech-primary rounded-full block shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
        {title}
      </h2>
      {subtitle && <p className="text-slate-400 mt-2 text-sm md:text-base ml-3">{subtitle}</p>}
    </div>
  );
};