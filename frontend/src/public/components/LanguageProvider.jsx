/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useLanguageStore from '@/api/store/language-store';

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const { currentLanguage } = useLanguageStore();

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage, i18n]);

  return <>{children}</>;
};