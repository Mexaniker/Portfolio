import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProjectCard } from './components/ProjectCard';
import { ServiceCard } from './components/ServiceCard';
import { Navbar } from './components/Navbar';
import { SectionHeader } from './components/SectionHeader';
import { PROJECTS as STATIC_PROJECTS, SERVICES as STATIC_SERVICES, HERO_DATA as STATIC_HERO, SOCIALS as STATIC_SOCIALS } from './constants';
import { ProjectModal } from './components/ProjectModal';
import { ServiceModal } from './components/ServiceModal';
import { Project, Service, ProfileData, SocialLink } from './types';
import { Mail, Settings } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { AdminPanel } from './components/AdminPanel';
import { Login } from './components/Login';
import * as LucideIcons from 'lucide-react';

// VK Icon Definition
const VKIcon = ({ size = 20, className = "" }: { size?: number | string, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path 
      d="M7 6h1.5c1.4 0 1.8 2.2 2.4 4.1.2.5.4 1 .7 1 .3 0 .3-.6.3-1.6V7.5c0-1.1.2-1.5 1.4-1.5h1.5c.4 0 .6.2.6.5 0 .2-.1.4-.4.5-.4.1-.5.5-.5 1.3v3.5c0 .4 0 .7.5.7.4 0 1.2-2 2-4.5.2-.5.5-.8 1.1-.8h1.5c.6 0 .9.4.9.9 0 .5-.8 1.8-2.4 4.1-1.2 1.7-1.4 2-1.1 2.5.2.3.9 1 2.4 2.5 1.4 1.3 1.7 1.8 1.7 2.3 0 .5-.4.9-1.5.9h-1.5c-.8 0-1.4-.4-2-1.2-.5-.8-1.2-1.7-1.5-1.7-.4 0-.6.2-.6.6v1.2c0 .6-.2.9-1.2.9h-1c-2.4 0-5.5-3-6.8-7.2-.5-1.5-.8-3.3-.8-3.8 0-.5.4-.8 1-.8z"
      stroke="none"
      fill="currentColor"
    />
  </svg>
);

/* 
  --- BACKGROUND OPTIONS ---
  1. TECHNICAL GRID (Текущий выбор):
     bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]

  2. DOT MATRIX (Точки):
     bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:32px_32px]
*/

const BACKGROUND_STYLE = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]";

const App: React.FC = () => {
  // Routing State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Data State - Initialize empty to prevent flickering
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<ProfileData>({ hero: STATIC_HERO, socials: STATIC_SOCIALS });
  
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // 1. Check Auth State & URL
  useEffect(() => {
    // Check URL for ?admin param (initial load only)
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('admin') !== null) {
          setIsAdminMode(true);
        }
    } catch (e) {
        // Silently ignore navigation errors in strict sandboxes
    }

    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Data from Firebase
  const fetchData = async () => {
    if (!db) {
      console.log("Firebase not configured, using static data");
      setProjects(STATIC_PROJECTS);
      setServices(STATIC_SERVICES);
      setProfile({ hero: STATIC_HERO, socials: STATIC_SOCIALS });
      setIsLoading(false);
      return;
    }

    try {
      const projectsSnap = await getDocs(collection(db, 'projects'));
      const servicesSnap = await getDocs(collection(db, 'services'));
      const profileSnap = await getDoc(doc(db, 'settings', 'profile'));

      // Process Projects
      if (!projectsSnap.empty) {
        setProjects(projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      } else {
        // DB Connected but empty? Show empty array, NOT static data.
        setProjects([]); 
      }

      // Process Services
      if (!servicesSnap.empty) {
        const fetchedServices = servicesSnap.docs.map(doc => {
            const data = doc.data();
            // Restore Icon component from string name
            const iconName = data.iconName || 'Box';
            let IconComponent = (LucideIcons as any)[iconName];
            if (!IconComponent && iconName === 'VK') IconComponent = VKIcon;
            if (!IconComponent) IconComponent = LucideIcons.Box;
            
            return { id: doc.id, ...data, icon: IconComponent } as Service;
        });
        setServices(fetchedServices);
      } else {
        // DB Connected but empty? Show empty array.
        setServices([]);
      }

      // Process Profile
      if (profileSnap.exists()) {
          const data = profileSnap.data();
          // Restore Social Icons
          const socials = (data.socials || []).map((s: any) => {
              const iconName = s.iconName || 'Link';
              let IconComponent = (LucideIcons as any)[iconName];
              if (!IconComponent && iconName === 'VK') IconComponent = VKIcon;
              if (!IconComponent) IconComponent = LucideIcons.Link;
              
              return { ...s, icon: IconComponent } as SocialLink;
          });
          setProfile({
              hero: data.hero as any,
              socials: socials
          });
      } else {
          // Keep static hero only if DB profile is missing (to avoid broken layout)
          // or you could set empty strings if preferred.
          setProfile({ hero: STATIC_HERO, socials: STATIC_SOCIALS });
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      // Only fallback to static on critical error if needed, 
      // but showing empty state is often less confusing than showing fake data.
      setProjects([]); 
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdminModeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const newMode = !isAdminMode;
    setIsAdminMode(newMode);
    
    try {
        const url = new URL(window.location.href);
        if (newMode) {
            url.searchParams.set('admin', 'true');
        } else {
            url.searchParams.delete('admin');
        }
        window.history.pushState({}, '', url.toString());
    } catch (err) {
        // Fallback for sandboxed environments where history API might be restricted
        // Silently fail as the UI state is already updated
    }
  };

  // --- RENDER LOGIC ---

  if (isAdminMode) {
    if (!isAuthenticated) {
      return (
        <>
            <div className={`fixed inset-0 z-[-1] bg-tech-bg ${BACKGROUND_STYLE}`} />
            <div className="min-h-screen relative">
                <button 
                    onClick={handleAdminModeToggle}
                    className="fixed top-4 left-4 z-50 text-slate-500 hover:text-white flex items-center gap-2 text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm"
                >
                    ← Назад к сайту
                </button>
                <Login />
            </div>
        </>
      );
    }
    return (
      <div className="relative">
          <button 
                onClick={handleAdminModeToggle}
                className="fixed bottom-4 left-4 z-[60] text-slate-500 hover:text-white flex items-center gap-2 text-xs bg-black/80 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg"
            >
                ← Выйти из админки
            </button>
          <AdminPanel 
            initialProjects={projects} 
            initialServices={services} 
            initialProfile={profile}
            onUpdate={fetchData} 
          />
      </div>
    );
  }

  return (
    <>
        {/* Background Layer - Fixed position to create depth effect */}
        <div className={`fixed inset-0 z-[-1] bg-tech-bg ${BACKGROUND_STYLE}`} />

        {/* Content Layer - Scrolls over the background */}
        <div className="min-h-screen pb-32 md:pb-24 w-full max-w-[1600px] mx-auto px-0 sm:px-4 relative">
        
        {/* Hero Section */}
        <div id="hero">
            <Hero data={profile.hero} socials={profile.socials} />
        </div>

        {/* Projects Section */}
        <section id="projects" className="px-4 py-8">
            <SectionHeader 
            title="Кейсы"
            subtitle="Проекты повышающие эффективность" 
            />
            {isLoading ? (
            <div className="flex justify-center p-8"><div className="w-8 h-8 border-2 border-tech-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.length > 0 ? (
                    projects.map((project) => (
                    <ProjectCard 
                        key={project.id} 
                        project={project} 
                        onClick={setSelectedProject}
                    />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 border border-dashed border-tech-border rounded-xl bg-tech-card/30">
                        <p className="text-slate-500">Кейсы еще не добавлены.</p>
                        {/* Hint for owner */}
                        <p className="text-xs text-slate-600 mt-2">Зайдите в Admin панель, чтобы добавить первый проект.</p>
                    </div>
                )}
            </div>
            )}
        </section>

        {/* Services Section */}
        <section id="services" className="px-4 py-8">
            <SectionHeader 
            title="Мои Услуги" 
            subtitle="Чем я могу быть полезен вашему бизнесу" 
            />
            {isLoading ? (
            <div className="flex justify-center p-8"><div className="w-8 h-8 border-2 border-tech-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.length > 0 ? (
                    services.map((service) => (
                    <ServiceCard 
                        key={service.id} 
                        service={service} 
                        onClick={setSelectedService}
                    />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        Услуги пока не добавлены.
                    </div>
                )}
            </div>
            )}
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-4 py-12 mb-8">
            <div className="bg-gradient-to-br from-tech-card to-tech-bg border border-tech-border rounded-2xl p-6 md:p-10 text-center relative overflow-hidden shadow-2xl">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-tech-accent/10 blur-[80px] rounded-full pointer-events-none"></div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
                Готовы обсудить проект?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto relative z-10">
                Напишите мне в Telegram или на почту, чтобы обсудить детали вашей задачи и получить предварительную оценку.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                {/* Try to find Telegram link in socials, else fallback */}
                {(() => {
                    const tgLink = profile.socials.find(s => s.platform.toLowerCase().includes('telegram'))?.url || "https://t.me/username";
                    return (
                        <a 
                        href={tgLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-tech-primary text-black font-bold flex items-center justify-center gap-2 hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                        >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                        </svg>
                        Telegram
                        </a>
                    )
                })()}
                
                <a 
                href="mailto:hello@example.com"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-tech-card border border-tech-border text-white font-medium flex items-center justify-center gap-2 hover:bg-tech-border transition-colors"
                >
                <Mail size={18} />
                Email
                </a>
            </div>
            </div>
            
            <div className="text-center mt-12 text-xs text-slate-600 font-mono flex items-center justify-center gap-4">
            <span>&copy; {new Date().getFullYear()} AI Portfolio.</span>
            <button 
                onClick={handleAdminModeToggle}
                className="hover:text-white transition-colors flex items-center gap-1 opacity-50 hover:opacity-100 bg-transparent border-none cursor-pointer p-0"
            >
                <Settings size={12} />
                Admin
            </button>
            </div>
        </section>

        {/* Navigation */}
        <Navbar />

        {/* Modals */}
        {selectedProject && (
            <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            />
        )}
        
        {selectedService && (
            <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            />
        )}
        </div>
    </>
  );
};

export default App;