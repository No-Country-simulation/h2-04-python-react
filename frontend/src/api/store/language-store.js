import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import i18next from 'i18next';

const getInitialLanguage = () => {
  const storedLanguage = localStorage.getItem('language');
  if (storedLanguage) {
    return JSON.parse(storedLanguage).state.currentLanguage;
  }
  
  const browserLanguage = navigator.language.split('-')[0];
  return ['es', 'en'].includes(browserLanguage) ? browserLanguage : 'es';
};

const useLanguageStore = create(
  persist(
    (set) => ({
      currentLanguage: getInitialLanguage(),
      handleLanguageChange: (newLanguage) => {
        i18next.changeLanguage(newLanguage);
        set(() => ({ currentLanguage: newLanguage }));
      }
    }),
    {
      name: "language",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useLanguageStore;