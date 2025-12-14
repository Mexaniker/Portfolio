import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
// Removed Firebase Storage imports
import { Project, Service, TagType, ProfileData, SocialLink, ThemeSettings } from '../types';
import { PROJECTS, SERVICES } from '../constants';
import { Plus, Trash2, LogOut, UploadCloud, Edit3, User, X, Image as ImageIcon, Loader2, ArrowUp, ArrowDown, Palette, ToggleLeft, ToggleRight, Snowflake } from 'lucide-react';
import * as Icons from 'lucide-react';

interface AdminPanelProps {
  initialProjects: Project[];
  initialServices: Service[];
  initialProfile: ProfileData;
  initialTheme: ThemeSettings;
  onUpdate: () => void;
}

// --- CLOUDINARY CONFIGURATION ---
// 1. Зарегистрируйтесь на https://cloudinary.com (бесплатно)
// 2. Settings -> Upload -> Add upload preset -> Signing Mode: Unsigned
// 3. Вставьте ваши данные ниже:
const CLOUDINARY_CLOUD_NAME: string = "db6a3tfsy"; // Замените на ваш Cloud Name
const CLOUDINARY_UPLOAD_PRESET: string = "Portfolio"; // Замените на ваш Unsigned Preset Name

// Custom VK Icon Component
const VKIcon = ({ size = 24, className = "" }: { size?: number | string, className?: string }) => (
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

const ICON_OPTIONS = [
  "Bot", "Brain", "BrainCircuit", "Cpu", "Sparkles", "Microchip", 
  "Code2", "Terminal", "Globe", "Smartphone", "Laptop", "Layout", 
  "Zap", "Workflow", "GitBranch", "Database", "Server", "Cloud", 
  "BarChart3", "TrendingUp", "Rocket", "Target", "Briefcase", 
  "MessageSquare", "MessageCircle", "VK", "Headphones", "Shield", "Lock", "Layers", "Box", "Wrench",
  "Send", "Instagram", "Twitter", "Linkedin", "Github", "Youtube", "Facebook", "Mail"
];

const BACKGROUND_STYLE = "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]";

// --- HELPER COMPONENT FOR IMAGE UPLOAD ---
const ImageUploader = ({ 
    currentUrl, 
    onUploadComplete 
}: { 
    currentUrl: string, 
    onUploadComplete: (url: string) => void 
}) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simple validation to check if user updated the config
        if (CLOUDINARY_CLOUD_NAME === "demo" && CLOUDINARY_UPLOAD_PRESET === "docs_upload_example_us_preset") {
            alert("Пожалуйста, настройте Cloudinary в файле AdminPanel.tsx (строки 18-19). Сейчас используется демо-режим, который может не работать.");
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            
            // Cloudinary API Endpoint
            const apiEndpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
            
            const response = await fetch(apiEndpoint, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.secure_url) {
                onUploadComplete(data.secure_url);
            } else {
                console.error("Cloudinary Error:", data);
                alert("Ошибка загрузки. Проверьте Cloud Name и Preset в коде.");
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Ошибка сети при загрузке изображения.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex gap-3 items-center">
            <div className="flex-1">
                <input 
                    value={currentUrl || ''} 
                    onChange={(e) => onUploadComplete(e.target.value)}
                    placeholder="Вставьте ссылку или загрузите фото ->"
                    className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none text-sm"
                />
            </div>
            <label className={`
                flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-tech-border cursor-pointer transition-all flex-shrink-0
                ${uploading ? 'bg-tech-card opacity-50 cursor-wait' : 'bg-tech-card hover:bg-tech-border hover:text-white text-slate-400'}
            `}>
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                <span className="text-sm font-medium hidden sm:inline">
                    {uploading ? 'Загрузка...' : 'Загрузить'}
                </span>
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    disabled={uploading}
                />
            </label>
            {/* Tiny Preview */}
            {currentUrl && (
                <div className="w-12 h-12 rounded border border-tech-border bg-black overflow-hidden flex-shrink-0">
                    <img src={currentUrl} alt="" className="w-full h-full object-cover" />
                </div>
            )}
        </div>
    );
};

// Extracted Component to prevent re-mount/state-loss issues
const ProfileEditor = ({ 
    initialData, 
    onSave, 
    loading 
}: { 
    initialData: ProfileData, 
    onSave: (data: ProfileData) => void, 
    loading: boolean 
}) => {
    const [formData, setFormData] = useState<ProfileData>(initialData);

    // Update local state if parent state changes (e.g. after fresh fetch)
    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const updateHero = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    const addSocial = () => {
        setFormData(prev => ({
            ...prev,
            socials: [...prev.socials, { platform: 'New', url: '#', iconName: 'Link', icon: Icons.Link } as SocialLink]
        }));
    };

    const updateSocial = (index: number, field: keyof SocialLink, value: any) => {
        const newSocials = [...formData.socials];
        // If updating iconName, we can optionally update the icon component for preview
        if (field === 'iconName') {
             let IconComp = (Icons as any)[value];
             if (!IconComp && value === 'VK') IconComp = VKIcon;
             if (!IconComp) IconComp = Icons.Link;

             newSocials[index] = { ...newSocials[index], iconName: value, icon: IconComp };
        } else {
             newSocials[index] = { ...newSocials[index], [field]: value };
        }
        setFormData(prev => ({ ...prev, socials: newSocials }));
    };

    const removeSocial = (index: number) => {
        const newSocials = formData.socials.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, socials: newSocials }));
    };

    return (
        <div className="bg-tech-card border border-tech-border rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-tech-border pb-4">Редактирование профиля</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Avatar & Basics */}
                <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-black border border-tech-border flex-shrink-0">
                            <img src={formData.hero.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                             <label className="text-xs text-slate-500 mb-1 block">Ссылка на аватар</label>
                             <ImageUploader 
                                currentUrl={formData.hero.avatarUrl}
                                onUploadComplete={(url) => updateHero('avatarUrl', url)}
                             />
                        </div>
                    </div>
                    
                    <div>
                         <label className="text-xs text-slate-500 mb-1 block">Имя (H1)</label>
                         <input 
                            value={formData.hero.name}
                            onChange={e => updateHero('name', e.target.value)}
                            className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none"
                         />
                    </div>
                    <div>
                         <label className="text-xs text-slate-500 mb-1 block">Профессия / Заголовок</label>
                         <input 
                            value={formData.hero.title}
                            onChange={e => updateHero('title', e.target.value)}
                            className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none"
                         />
                    </div>
                     <div>
                         <label className="text-xs text-slate-500 mb-1 block">Статус (бейдж)</label>
                         <input 
                            value={formData.hero.status}
                            onChange={e => updateHero('status', e.target.value)}
                            className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none"
                         />
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="text-xs text-slate-500 mb-1 block">О себе (Bio)</label>
                    <textarea 
                        value={formData.hero.bio}
                        onChange={e => updateHero('bio', e.target.value)}
                        className="w-full h-full min-h-[200px] bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none"
                    />
                </div>
            </div>

            {/* Socials */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-bold">Соцсети и кнопки</h4>
                    <button onClick={addSocial} className="text-xs flex items-center gap-1 bg-tech-primary/10 text-tech-primary px-2 py-1 rounded hover:bg-tech-primary/20">
                        <Plus size={14} /> Добавить
                    </button>
                </div>
                
                <div className="space-y-3">
                    {formData.socials.map((social, idx) => {
                        // Resolve Icon for preview
                        const iconName = social.iconName || 'Link';
                        let IconPreview = (Icons as any)[iconName];
                        if (!IconPreview && iconName === 'VK') IconPreview = VKIcon;
                        if (!IconPreview) IconPreview = Icons.Link;
                        
                        return (
                            <div key={idx} className="flex flex-col sm:flex-row gap-3 bg-tech-bg p-3 rounded-lg border border-tech-border items-start sm:items-center">
                                 {/* Icon Picker Trigger (Simple) */}
                                 <div className="flex-shrink-0 flex items-center gap-2">
                                     <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-slate-400">
                                         <IconPreview size={18} />
                                     </div>
                                     <select 
                                        value={iconName}
                                        onChange={(e) => updateSocial(idx, 'iconName', e.target.value)}
                                        className="bg-black border border-tech-border text-white text-xs p-2 rounded w-28"
                                     >
                                         {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                     </select>
                                 </div>
                                 <input 
                                    placeholder="Platform Name"
                                    value={social.platform}
                                    onChange={e => updateSocial(idx, 'platform', e.target.value)}
                                    className="flex-1 bg-black border border-tech-border p-2 rounded text-white text-sm"
                                 />
                                 <input 
                                    placeholder="URL (https://...)"
                                    value={social.url}
                                    onChange={e => updateSocial(idx, 'url', e.target.value)}
                                    className="flex-[2] bg-black border border-tech-border p-2 rounded text-white text-sm w-full"
                                 />
                                 <button onClick={() => removeSocial(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded">
                                     <Trash2 size={16} />
                                 </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-tech-border">
                <button 
                    onClick={() => onSave(formData)}
                    disabled={loading}
                    className="px-8 py-3 bg-tech-primary text-black font-bold rounded-lg hover:bg-cyan-300 transition-colors flex items-center gap-2"
                >
                    {loading ? 'Сохранение...' : 'Сохранить профиль'}
                </button>
            </div>
        </div>
    );
};

// === FORM COMPONENTS MOVED OUTSIDE ===

const ProjectForm = ({ project, onSave, onCancel, loading }: { project?: Partial<Project>, onSave: (p: any) => void, onCancel: () => void, loading: boolean }) => {
    const [formData, setFormData] = useState<Partial<Project>>(() => {
        if (project && project.id) return { ...project };
        return {
            title: '', 
            description: '', 
            imageUrl: '', 
            tags: [], 
            features: [], 
            stats: ''
        };
    });

    const handleSaveClick = () => {
        // Sanitize features (remove empty strings)
        const cleanData = {
            ...formData,
            features: formData.features?.filter(f => f.trim().length > 0) || []
        };
        onSave(cleanData);
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
        <div className="bg-tech-card border border-tech-border rounded-xl p-6 w-full max-w-2xl my-8 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-4">{(formData as any).id ? 'Редактировать проект' : 'Новый проект'}</h3>
          <div className="space-y-4">
            <div>
                <label className="text-xs text-slate-500 mb-1 block">Название проекта</label>
                <input 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none transition-colors"
                />
            </div>
             <div>
                <label className="text-xs text-slate-500 mb-1 block">Изображение</label>
                <ImageUploader 
                    currentUrl={formData.imageUrl || ''}
                    onUploadComplete={(url) => setFormData({...formData, imageUrl: url})}
                />
            </div>
            <div>
                <label className="text-xs text-slate-500 mb-1 block">Краткое описание (для карточки)</label>
                <textarea 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white h-24 focus:border-tech-primary outline-none transition-colors"
                />
            </div>
            <div>
                <label className="text-xs text-slate-500 mb-1 block">Полное описание (в модальном окне)</label>
                <textarea 
                  value={formData.longDescription || ''} 
                  onChange={e => setFormData({...formData, longDescription: e.target.value})}
                  className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white h-32 focus:border-tech-primary outline-none transition-colors"
                />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Тэги (через запятую)</label>
              <input 
                value={formData.tags?.join(', ') || ''} 
                onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()) as TagType[]})}
                className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none transition-colors"
              />
            </div>
             <div>
              <label className="text-xs text-slate-500 mb-1 block">Особенности (каждая с новой строки)</label>
              <textarea 
                value={formData.features?.join('\n') || ''} 
                onChange={e => setFormData({...formData, features: e.target.value.split('\n')})}
                className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white h-24 focus:border-tech-primary outline-none transition-colors"
              />
            </div>
            <div>
                <label className="text-xs text-slate-500 mb-1 block">Бейдж статистики</label>
                <input 
                  placeholder="Например: Saved 20hrs" 
                  value={formData.stats || ''} 
                  onChange={e => setFormData({...formData, stats: e.target.value})}
                  className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none transition-colors"
                />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button onClick={onCancel} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">Отмена</button>
              <button 
                  onClick={handleSaveClick} 
                  disabled={loading}
                  className="px-6 py-2 bg-tech-primary text-black rounded-lg font-bold hover:bg-cyan-300 transition-colors flex items-center gap-2"
              >
                  {loading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>}
                  Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

const ServiceForm = ({ service, onSave, onCancel, loading }: { service?: Partial<Service>, onSave: (p: any) => void, onCancel: () => void, loading: boolean }) => {
    const [formData, setFormData] = useState<Partial<Service>>(() => {
        if (service && service.id) return { ...service };
        return {
            title: '', description: '', iconName: 'Box', priceStart: '', features: [], longDescription: ''
        };
    });

    const handleSaveClick = () => {
         const cleanData = {
            ...formData,
            features: formData.features?.filter(f => f.trim().length > 0) || []
        };
        onSave(cleanData);
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
        <div className="bg-tech-card border border-tech-border rounded-xl p-6 w-full max-w-2xl shadow-2xl h-[90vh] flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4 flex-shrink-0">{(formData as any).id ? 'Редактировать услугу' : 'Новая услуга'}</h3>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div>
                <label className="text-xs text-slate-500 mb-1 block">Название услуги</label>
                <input 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none transition-colors"
                />
            </div>
            
            <div>
                <label className="text-xs text-slate-500 mb-2 block">Выберите иконку</label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 border border-tech-border rounded-lg bg-tech-bg max-h-48 overflow-y-auto custom-scrollbar">
                    {ICON_OPTIONS.map(iconName => {
                        const IconComp = (Icons as any)[iconName] || (iconName === 'VK' ? VKIcon : Icons.Box);
                        const isSelected = (formData as any).iconName === iconName;
                        return (
                            <button
                                key={iconName}
                                type="button"
                                onClick={() => setFormData({...formData, iconName: iconName} as any)}
                                className={`aspect-square flex items-center justify-center rounded-lg border transition-all duration-200 ${
                                    isSelected 
                                    ? 'bg-tech-primary/20 border-tech-primary text-tech-primary shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                                    : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                                title={iconName}
                            >
                                <IconComp size={24} strokeWidth={1.5} />
                            </button>
                        )
                    })}
                </div>
            </div>
             
             {/* ... rest of inputs ... */}
             <div>
                <label className="text-xs text-slate-500 mb-1 block">Цена (от)</label>
                <input 
                  placeholder="от $500" 
                  value={formData.priceStart || ''} 
                  onChange={e => setFormData({...formData, priceStart: e.target.value})}
                  className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white focus:border-tech-primary outline-none transition-colors"
                />
            </div>
            <div>
                <label className="text-xs text-slate-500 mb-1 block">Краткое описание</label>
                <textarea 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white h-24 focus:border-tech-primary outline-none transition-colors"
                />
            </div>
            <div>
                <label className="text-xs text-slate-500 mb-1 block">Полное описание</label>
                <textarea 
                  value={formData.longDescription || ''} 
                  onChange={e => setFormData({...formData, longDescription: e.target.value})}
                  className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white h-32 focus:border-tech-primary outline-none transition-colors"
                />
            </div>
             <div>
              <label className="text-xs text-slate-500 mb-1 block">Что входит (каждый пункт с новой строки)</label>
              <textarea 
                value={formData.features?.join('\n') || ''} 
                onChange={e => setFormData({...formData, features: e.target.value.split('\n')})}
                className="w-full bg-tech-bg border border-tech-border p-3 rounded-lg text-white h-24 focus:border-tech-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 flex-shrink-0 mt-4">
            <button onClick={onCancel} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">Отмена</button>
            <button 
                onClick={handleSaveClick} 
                disabled={loading}
                className="px-6 py-2 bg-tech-primary text-black rounded-lg font-bold hover:bg-cyan-300 transition-colors flex items-center gap-2"
            >
                {loading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>}
                Сохранить
            </button>
          </div>
        </div>
      </div>
    );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ initialProjects, initialServices, initialProfile, initialTheme, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'profile' | 'styles'>('projects');
  
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [theme, setTheme] = useState<ThemeSettings>(initialTheme);
  
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
    setServices(initialServices);
    setProfile(initialProfile);
    setTheme(initialTheme);
  }, [initialProjects, initialServices, initialProfile, initialTheme]);

  const handleLogout = () => {
    if (auth) auth.signOut();
  };

  const uploadSeedData = async () => {
    if (!db) return;
    if (!window.confirm('Это перезапишет ВСЕ данные (в том числе Профиль) дефолтными значениями. Продолжить?')) return;
    
    setLoading(true);
    try {
      // Upload Projects
      for (let i = 0; i < PROJECTS.length; i++) {
        const p = PROJECTS[i];
        await db.collection('projects').doc(p.id).set({ ...p, order: i });
      }
      // Upload Services
      for (let i = 0; i < SERVICES.length; i++) {
        const s = SERVICES[i];
        const serviceData = {
           ...s,
           iconName: (s.icon as any).displayName || s.icon.name || 'Box',
           order: i
        };
        delete (serviceData as any).icon;
        await db.collection('services').doc(s.id).set(serviceData);
      }
      // Upload Profile Data if needed (Optional, usually static consts)
      alert('Данные сброшены (проекты/услуги).');
      
      onUpdate();
    } catch (e) {
      console.error(e);
      alert('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!db || !window.confirm('Удалить элемент?')) return;
    try {
      await db.collection(collectionName).doc(id).delete();
      onUpdate();
    } catch (e) {
      console.error(e);
      alert('Ошибка удаления');
    }
  };

  const handleSave = async (collectionName: string, data: any) => {
    if (!db) {
        alert("База данных не подключена.");
        setEditingItem(null);
        return;
    }
    setLoading(true);
    try {
      const id = data.id || db.collection(collectionName).doc().id;
      const dataToSave = { ...data, id };
      
      if (collectionName === 'services') {
          delete dataToSave.icon; 
          if (!dataToSave.iconName) dataToSave.iconName = 'Box';
      }

      // If new item, add to the end
      if (!data.id) {
          const currentList = collectionName === 'projects' ? projects : services;
          dataToSave.order = currentList.length;
      }

      await db.collection(collectionName).doc(id).set(dataToSave);
      
      // Optimistic update
      if (collectionName === 'projects') {
          const newProjects = data.id 
             ? projects.map(p => p.id === id ? { ...p, ...dataToSave } : p)
             : [...projects, dataToSave];
          setProjects(newProjects as Project[]);
      } else {
          // Reconstruct icon for optimistic update
          let IconComp = (Icons as any)[dataToSave.iconName] || Icons.Box;
          const newService = { ...dataToSave, icon: IconComp };
          const newServices = data.id 
             ? services.map(s => s.id === id ? newService : s)
             : [...services, newService];
          setServices(newServices as Service[]);
      }

      setEditingItem(null);
      // Background fetch to sync
      onUpdate();
    } catch (e: any) {
      console.error(e);
      alert('Ошибка сохранения: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveItem = async (collectionName: 'projects' | 'services', index: number, direction: 'up' | 'down') => {
      if (!db) return;
      
      const list = collectionName === 'projects' ? [...projects] : [...services];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= list.length) return;

      // Swap in local array
      [list[index], list[targetIndex]] = [list[targetIndex], list[index]];

      // Update local state immediately
      if (collectionName === 'projects') setProjects(list as Project[]);
      else setServices(list as Service[]);

      // Update Firestore in background (Batch write)
      try {
          const batch = db.batch();
          list.forEach((item, idx) => {
              const ref = db.collection(collectionName).doc(item.id);
              batch.update(ref, { order: idx });
          });
          await batch.commit();
          // No need to call onUpdate() here as we already updated local state and DB is consistent
      } catch (e) {
          console.error("Error reordering:", e);
          alert("Ошибка при сохранении порядка сортировки");
          onUpdate(); // Revert to server state on error
      }
  };

  const handleSaveProfile = async (newProfileData: ProfileData) => {
      if (!db) {
          alert("БД не подключена.");
          return;
      }
      setLoading(true);
      try {
          // Prepare for DB: remove icon components from socials
          const socialsForDb = newProfileData.socials.map(s => {
              const { icon, ...rest } = s as any;
              return { ...rest, iconName: s.iconName || 'Link' };
          });

          const dataToSave = {
              hero: newProfileData.hero,
              socials: socialsForDb
          };

          await db.collection('settings').doc('profile').set(dataToSave);
          onUpdate();
          alert('Профиль сохранен!');
      } catch (e: any) {
          console.error(e);
          alert('Ошибка сохранения профиля: ' + e.message);
      } finally {
          setLoading(false);
      }
  };

  const toggleThemeMode = async (mode: 'isNewYearMode', value: boolean) => {
      if (!db) {
          alert("БД не подключена.");
          return;
      }
      
      const newTheme = { ...theme, [mode]: value };
      setTheme(newTheme); // Optimistic

      try {
          await db.collection('settings').doc('theme').set(newTheme);
          onUpdate();
      } catch (e: any) {
          console.error(e);
          alert('Ошибка сохранения темы');
          setTheme(theme); // Revert
      }
  };

  return (
    <>
        <div className={`fixed inset-0 z-[-1] bg-tech-bg ${BACKGROUND_STYLE}`} />
        <div className="min-h-screen relative pb-20">
        {/* Admin Header */}
        <div className="bg-tech-card border-b border-tech-border p-4 sticky top-0 z-40 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Admin Mode
            </h1>
            <div className="flex gap-2">
                <button 
                    onClick={uploadSeedData}
                    disabled={loading}
                    className="p-2 text-tech-primary hover:bg-tech-border rounded-lg text-sm flex items-center gap-1 border border-tech-primary/30"
                    title="Загрузить стандартные данные из constants.tsx в БД"
                >
                    <UploadCloud size={16} />
                    <span className="hidden sm:inline">Reset Data</span>
                </button>
                <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-white hover:bg-tech-border rounded-lg"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>

        <div className="max-w-7xl mx-auto p-4">
            {/* Tabs */}
            <div className="flex gap-2 sm:gap-4 mb-6 border-b border-tech-border overflow-x-auto">
                <button 
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'text-tech-primary border-b-2 border-tech-primary' : 'text-slate-500 hover:text-white'}`}
                    onClick={() => setActiveTab('projects')}
                >
                    Проекты ({projects.length})
                </button>
                <button 
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'services' ? 'text-tech-primary border-b-2 border-tech-primary' : 'text-slate-500 hover:text-white'}`}
                    onClick={() => setActiveTab('services')}
                >
                    Услуги ({services.length})
                </button>
                <button 
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'profile' ? 'text-tech-primary border-b-2 border-tech-primary' : 'text-slate-500 hover:text-white'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <User size={16} />
                    Профиль
                </button>
                <button 
                    className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'styles' ? 'text-tech-primary border-b-2 border-tech-primary' : 'text-slate-500 hover:text-white'}`}
                    onClick={() => setActiveTab('styles')}
                >
                    <Palette size={16} />
                    Стилизации
                </button>
            </div>

            {/* List Content */}
            {activeTab === 'profile' ? (
                <ProfileEditor 
                    initialData={profile} 
                    onSave={handleSaveProfile} 
                    loading={loading} 
                />
            ) : activeTab === 'styles' ? (
                 <div className="bg-tech-card border border-tech-border rounded-xl p-6 shadow-lg max-w-xl mx-auto">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-tech-border pb-4 flex items-center gap-2">
                        <Palette size={20} className="text-tech-primary"/>
                        Управление темами
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-tech-bg border border-tech-border">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${theme.isNewYearMode ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-500'}`}>
                                    <Snowflake size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Новогоднее настроение</h4>
                                    <p className="text-xs text-slate-500 mt-1">Включает легкий снегопад</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => toggleThemeMode('isNewYearMode', !theme.isNewYearMode)}
                                className={`text-2xl transition-colors ${theme.isNewYearMode ? 'text-tech-primary' : 'text-slate-600'}`}
                            >
                                {theme.isNewYearMode ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                            </button>
                        </div>
                    </div>
                 </div>
            ) : (
                <div className="grid gap-4">
                    <button 
                        onClick={() => setEditingItem({})}
                        className="w-full py-3 border-2 border-dashed border-tech-border rounded-xl text-slate-500 hover:text-tech-primary hover:border-tech-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Добавить {activeTab === 'projects' ? 'Проект' : 'Услугу'}
                    </button>

                    {activeTab === 'projects' && projects.map((p, idx) => (
                        <div key={p.id} className="bg-tech-card border border-tech-border rounded-xl p-4 flex gap-4 items-center group">
                            {/* Order Controls */}
                            <div className="flex flex-col gap-1 mr-2">
                                <button 
                                    onClick={() => handleMoveItem('projects', idx, 'up')}
                                    disabled={idx === 0}
                                    className="p-1 text-slate-500 hover:text-white disabled:opacity-30 hover:bg-white/10 rounded"
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button 
                                    onClick={() => handleMoveItem('projects', idx, 'down')}
                                    disabled={idx === projects.length - 1}
                                    className="p-1 text-slate-500 hover:text-white disabled:opacity-30 hover:bg-white/10 rounded"
                                >
                                    <ArrowDown size={16} />
                                </button>
                            </div>

                            <div className="w-16 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0">
                                <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold truncate">{p.title}</h4>
                                <p className="text-xs text-slate-500 truncate">{p.description}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingItem(p)} className="p-2 hover:bg-white/10 rounded text-tech-primary"><Edit3 size={18} /></button>
                                <button onClick={() => handleDelete('projects', p.id)} className="p-2 hover:bg-red-500/20 rounded text-red-500"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'services' && services.map((s, idx) => {
                        const IconComp = s.icon;
                        return (
                            <div key={s.id} className="bg-tech-card border border-tech-border rounded-xl p-4 flex gap-4 items-center group">
                                {/* Order Controls */}
                                <div className="flex flex-col gap-1 mr-2">
                                    <button 
                                        onClick={() => handleMoveItem('services', idx, 'up')}
                                        disabled={idx === 0}
                                        className="p-1 text-slate-500 hover:text-white disabled:opacity-30 hover:bg-white/10 rounded"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleMoveItem('services', idx, 'down')}
                                        disabled={idx === services.length - 1}
                                        className="p-1 text-slate-500 hover:text-white disabled:opacity-30 hover:bg-white/10 rounded"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                </div>
                                
                                <div className="w-16 h-16 flex items-center justify-center bg-tech-bg rounded-lg text-tech-primary border border-tech-border flex-shrink-0">
                                    <IconComp size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold truncate">{s.title}</h4>
                                    <p className="text-xs text-slate-500 truncate">{s.description}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingItem(s)} className="p-2 hover:bg-white/10 rounded text-tech-primary"><Edit3 size={18} /></button>
                                    <button onClick={() => handleDelete('services', s.id)} className="p-2 hover:bg-red-500/20 rounded text-red-500"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Forms Modal (Only for Projects and Services) */}
        {editingItem && activeTab === 'projects' && (
            <ProjectForm 
                project={editingItem} 
                onSave={(data) => handleSave('projects', data)} 
                onCancel={() => setEditingItem(null)} 
                loading={loading}
            />
        )}
        {editingItem && activeTab === 'services' && (
            <ServiceForm 
                service={editingItem} 
                onSave={(data) => handleSave('services', data)} 
                onCancel={() => setEditingItem(null)} 
                loading={loading}
            />
        )}
        </div>
    </>
  );
};