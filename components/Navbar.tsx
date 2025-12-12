import React from 'react';
import { Home, Layers, Zap, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'hero', icon: Home, label: 'Главная' },
    { id: 'projects', icon: Layers, label: 'Кейсы' },
    { id: 'services', icon: Zap, label: 'Услуги' },
    { id: 'contact', icon: MessageSquare, label: 'Связь' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 md:pb-4 pointer-events-none flex justify-center">
      <nav className="bg-tech-bg/80 backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-3 pointer-events-auto shadow-2xl flex items-center gap-8 md:gap-12">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-1.5 rounded-lg group-hover:bg-white/5 transition-colors">
              <item.icon size={20} className="text-slate-400 group-hover:text-tech-primary transition-colors" />
            </div>
            <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-200 transition-colors">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};