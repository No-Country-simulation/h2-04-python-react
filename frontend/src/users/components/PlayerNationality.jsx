/* eslint-disable react/prop-types */
import {
  argentinaFlag,
  brazilFlag,
  spainFlag,
  franceFlag,
  englandFlag,
  norwayFlag,
  belgiumFlag,
} from "@/common/assets";
import { useTranslation } from "react-i18next";

const PlayerNationality = ({ nationality }) => {
    const { t } = useTranslation();
    const flagImages = {
        Argentina: argentinaFlag,
        Brazil: brazilFlag,
        Spain: spainFlag,
        France: franceFlag,
        England: englandFlag,
        Norway: norwayFlag,
        Belgium: belgiumFlag
      };

      const flagSrc = flagImages[nationality] || 'https://via.placeholder.com/24';
  return (
    <div className="flex flex-row items-center justify-between px-5 py-2.5 border-b last:border-b-0">
      <div className="flex flex-row items-center justify-between space-x-4">
        <img
          src={flagSrc}
          alt={`${nationality} flag icon`}
          width={32}
          height={24}
          className="w-auto h-6 object-cover"
        />
        <div className="flex flex-col ">
          <p className="text-sm text-normal text-[#8d8d8d]">{t('common.nationality')}</p>
          <p className="text-sm text-normal text-[#181818]">{t(`countries.${nationality}`)}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerNationality;
