'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'vi' | 'en' | 'zh';
type Theme = 'light' | 'dark';

import vi from '@/messages/vi.json';
import en from '@/messages/en.json';
import zh from '@/messages/zh.json';

type Messages = typeof vi;
const messages: Record<Lang, Messages> = { vi, en, zh };

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Messages;
  theme: Theme;
  toggleTheme: () => void;
}>({
  lang: 'vi',
  setLang: () => {},
  t: vi,
  theme: 'light',
  toggleTheme: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('vi');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: messages[lang], theme, toggleTheme }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);