import React, { useState } from 'react';
import { auth } from '../firebase';
import { Lock, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        setError("Firebase не настроен. Проверьте файл firebase.ts");
        return;
    }
    setLoading(true);
    setError('');

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err: any) {
      console.error(err);
      setError('Ошибка входа. Проверьте логин и пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tech-bg p-4">
      <div className="w-full max-w-md bg-tech-card border border-tech-border rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-tech-bg rounded-full flex items-center justify-center border border-tech-border text-tech-primary">
            <Lock size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-8">Admin Panel</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-tech-bg border border-tech-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tech-primary transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-tech-bg border border-tech-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tech-primary transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-tech-primary text-black font-bold py-3 rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
             <p className="text-xs text-slate-500">
                Защищенная зона. Если вы не администратор, вернитесь назад.
             </p>
        </div>
      </div>
    </div>
  );
};