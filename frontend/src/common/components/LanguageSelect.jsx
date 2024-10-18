/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import useLanguageStore from "@/api/store/language-store";
import { useTranslation } from "react-i18next";
import { spain, usa } from "../assets";

export default function LanguageSelect() {
  const { currentLanguage, handleLanguageChange } = useLanguageStore();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, []);

  const handleChange = (value) => {
    handleLanguageChange(value);
  };

  return (
    <Select value={currentLanguage} onValueChange={handleChange} className="border-none">
      <SelectTrigger className="w-[70px] border-none focus:ring-0" aria-label={t("selectLanguage")}>
        <SelectValue>
          {currentLanguage === "es" ? (
            <img src={spain} alt={t("Español")} />
          ) : (
            <img src={usa} alt={t("Inglés")} />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="es">
          <div className="flex flex-row gap-x-2">
            <img src={spain} alt={t("Español")} /> {t("Español")}
          </div>
        </SelectItem>
        <SelectItem value="en">
          <div className="flex flex-row gap-x-2">
            <img src={usa} alt={t("Inglés")} /> {t("Inglés")}
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}