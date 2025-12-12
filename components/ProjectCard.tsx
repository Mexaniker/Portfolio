import React from 'react';
import { Project, TagType } from '../types';
import { ArrowRight } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const TagColors: Record<TagType, string> = {
  [TagType.AI]: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  [TagType.AUTOMATION]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  [TagType.WEB]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  [TagType.BOT]: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      onClick={() => onClick(project)}
      className="group relative bg-tech-card border border-tech-border rounded-xl overflow-hidden hover:border-tech-primary/50 transition-all duration-300 flex flex-col h-full shadow-lg cursor-pointer hover:-translate-y-1"
    >
      
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <OptimizedImage
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full"
          imageClassName="object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-tech-card to-transparent z-10 opacity-60 pointer-events-none"></div>
        
        {project.stats && (
          <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-tech-primary shadow-lg">
            {project.stats}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-tech-primary transition-colors">
            {project.title}
          </h3>
        </div>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Footer: Tags and Button */}
        <div className="flex items-end justify-between gap-3 mt-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className={`text-[10px] px-2 py-1 rounded-md border font-medium ${TagColors[tag]}`}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Read Button */}
          <div className="flex-shrink-0">
             <span className="inline-flex items-center gap-1.5 text-xs font-bold text-tech-primary uppercase tracking-wider bg-tech-primary/10 px-3 py-1.5 rounded-lg border border-tech-primary/20 group-hover:bg-tech-primary group-hover:text-black transition-all">
              Читать
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};