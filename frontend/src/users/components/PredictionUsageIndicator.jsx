/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";

const PredictionUsageIndicator = ({ total, used }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row gap-x-2 justify-between items-center w-full py-4 bg-white">
      <p className="text-purpleWaki font-medium text-xs">
        {t("prediction.predictionUsed")}
      </p>
      <div className="flex items-center space-x-1.5">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`size-[11px] rounded-full ${
              index < used ? "bg-purpleWaki" : "border border-purpleWaki"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PredictionUsageIndicator;
