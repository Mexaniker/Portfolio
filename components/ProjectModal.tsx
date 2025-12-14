import React, { useEffect } from 'react';
import { Project } from '../types';
import { X, CheckCircle2 } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-full bg-tech-bg border border-tech-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[pulse_0.2s_ease-out_reverse]">
        
        {/* Header Image */}
        <div className="relative h-48 sm:h-64 flex-shrink-0 group w-full">
          <OptimizedImage
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full"
            imageClassName="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tech-bg via-transparent to-transparent pointer-events-none"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors border border-white/10 z-20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{project.title}</h2>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {project.stats && (
                 <div className="inline-block px-3 py-1 rounded-full bg-tech-primary/10 border border-tech-primary/20 text-tech-primary text-sm font-mono">
                   {project.stats}
                 </div>
              )}
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 border-l-2 border-tech-primary/30 pl-4 whitespace-pre-line">
                {project.longDescription || project.description}
              </div>
              
              {project.features && (
                <div className="mb-6 bg-tech-card/30 p-5 rounded-xl border border-tech-border/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-tech-accent"></span>
                    Ключевые особенности
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-400 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-tech-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-tech-border bg-tech-bg/95 flex justify-end gap-3 flex-shrink-0 backdrop-blur-sm">
            <button 
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-tech-border text-slate-300 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Закрыть
            </button>
        </div>
      </div>
    </div>
  );
};