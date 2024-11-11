/* eslint-disable react/prop-types */
import Flag from "react-world-flags";
import countries from "i18n-iso-countries";

import en from "i18n-iso-countries/langs/en.json";
import es from "i18n-iso-countries/langs/es.json";
import { whistle } from "@/common/assets";
import useLanguageStore from "@/api/store/language-store";

countries.registerLocale(en);
countries.registerLocale(es);

const countryNameToCode = {
  England: "GB-ENG",
};

const RefereeNationality = ({ refereeName, refereeNationality }) => {
  const { currentLanguage } = useLanguageStore();

  const getCountryCode = (country) => {
    if (countryNameToCode[country]) {
      return countryNameToCode[country];
    }

    const code = Object.keys(countries.getNames("en")).find(
      (code) =>
        countries.getName(code, "en")?.toLowerCase() === country.toLowerCase()
    );

    return code || country;
  };

  const countryCode = getCountryCode(refereeNationality);

  return (
    <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
      <div className="flex flex-row items-center justify-between space-x-4">
        <img
          src={whistle}
          alt="whistle icon"
          className="w-auto h-4 object-cover"
        />
        <div className="flex flex-col ">
          <p className="text-sm text-normal text-[#8d8d8d]">
            {currentLanguage === "en" ? "Referee" : "Arbitro"}
          </p>
          <div className="flex flex-row items-center gap-x-2">
            <p className="text-sm text-normal text-[#181818]  ">
              {refereeName || "-"}
            </p>
            <Flag
              code={countryCode}
              fallback={<span> </span>}
              width="24"
              height="16"
              className="rounded-sm w-6 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefereeNationality;
