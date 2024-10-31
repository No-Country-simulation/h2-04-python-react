/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import Flag from 'react-world-flags';
import countries from 'i18n-iso-countries';

import en from 'i18n-iso-countries/langs/en.json';
import es from 'i18n-iso-countries/langs/es.json';

countries.registerLocale(en);
countries.registerLocale(es);

const countryNameToCode = {
  'England': 'GB-ENG',
};

const specialTranslations = {
  'England': {
    'es': 'Inglaterra',
    'en': 'England'
  }
};

const PlayerNationality = ({ nationality }) => {
  const { t, i18n } = useTranslation();

  const getCountryCode = (country) => {
    if (countryNameToCode[country]) {
      return countryNameToCode[country];
    }

    const code = Object.keys(countries.getNames('en')).find(
      (code) => countries.getName(code, 'en')?.toLowerCase() === country.toLowerCase()
    );

    return code || country;
  };

  const countryCode = getCountryCode(nationality);

  const getCountryName = (country) => {
    if (specialTranslations[country] && specialTranslations[country][i18n.language]) {
      return specialTranslations[country][i18n.language];
    }

    const code = getCountryCode(country);
    return countries.getName(code, i18n.language) || country;
  };

  const countryName = getCountryName(nationality);

  return (
    <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
      <div className="flex flex-row items-center justify-between space-x-4">
      <Flag
          code={countryCode}
          fallback={<span>🏳️</span>}
          width="32"
          height="24"
          className="rounded-md w-8 h-6"
        />
        <div className="flex flex-col ">
          <p className="text-sm text-normal text-[#8d8d8d]">{t('common.nationality')}</p>
          <p className="text-sm text-normal text-[#181818]">{countryName}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerNationality;
