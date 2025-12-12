import React, { useEffect } from 'react';
import { Service } from '../types';
import { X, CheckCircle2 } from 'lucide-react';

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  const Icon = service.icon;

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
      <div className="relative w-full max-w-2xl max-h-full bg-tech-bg border border-tech-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[pulse_0.2s_ease-out_reverse]">
        
        {/* Header with Icon */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-tech-card to-tech-bg flex items-center justify-center border-b border-tech-border flex-shrink-0">
          <div className="absolute inset-0 bg-tech-primary/5"></div>
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-tech-bg border border-tech-border rounded-2xl flex items-center justify-center text-tech-primary shadow-lg z-10 shadow-tech-primary/10">
            <Icon size={40} strokeWidth={1.5} />
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-slate-400 hover:text-white hover:bg-black/40 transition-colors border border-transparent hover:border-white/10 z-20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="mb-2">
            <div className="flex items-center justify-between gap-4 mb-4">
               <h2 className="text-2xl sm:text-3xl font-bold text-white">{service.title}</h2>
               {service.priceStart && (
                 <div className="flex-shrink-0 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/20 text-tech-accent text-sm font-mono font-bold">
                   {service.priceStart}
                 </div>
               )}
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                {service.longDescription || service.description}
              </p>
              
              {service.features && (
                <div className="mb-6 bg-tech-card/30 p-5 rounded-xl border border-tech-border/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-tech-primary"></span>
                    Что входит в услугу
                  </h3>
                  <ul className="grid grid-cols-1 gap-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-tech-primary mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{feature}</span>
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
              className="px-6 py-2.5 rounded-xl bg-tech-primary text-black hover:bg-cyan-300 transition-colors text-sm font-bold shadow-lg shadow-cyan-500/20"
            >
              Обсудить задачу
            </button>
        </div>
      </div>
    </div>
  );
};