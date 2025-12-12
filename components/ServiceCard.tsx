import React from 'react';
import { Service } from '../types';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const Icon = service.icon;

  return (
    <div 
      className="group bg-tech-card/50 border border-tech-border rounded-xl p-5 hover:bg-tech-card transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={() => onClick(service)}
    >
      <div className="flex-1">
        <div className="w-12 h-12 bg-tech-bg rounded-lg flex items-center justify-center border border-tech-border mb-4 text-tech-primary shadow-[0_0_15px_-3px_rgba(34,211,238,0.15)] group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-tech-primary transition-colors">{service.title}</h3>
        <p className="text-slate-400 text-sm mb-3 leading-relaxed">{service.description}</p>
      </div>
      
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
        <div className="text-xs font-mono text-tech-accent font-medium bg-tech-accent/10 px-2 py-1 rounded">
          {service.priceStart}
        </div>
        
        <button 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-tech-primary uppercase tracking-wider hover:text-white transition-colors"
        >
          Подробнее
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};