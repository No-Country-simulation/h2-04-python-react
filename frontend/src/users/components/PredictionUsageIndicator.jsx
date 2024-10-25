/* eslint-disable react/prop-types */
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

const FuturePrediction = ({ date, used, total }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center ">
        <span className="text-xs text-gray-500">
          {format(parseISO(date), "MMM dd")}
        </span>
        <div className="flex flex-row space-x-1">
          {Array.from({ length: total }, (index) => (
            <div
              key={index}
              className={`size-[11px] rounded-full ${
                index < used ? "bg-purpleWaki" : "border border-purpleWaki"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PredictionUsageIndicator = ({ total, predictionData }) => {
  const { t } = useTranslation();
  const todaysData = predictionData[new Date().toISOString().slice(0, 10)];

  const renderedTodaysData = todaysData || {
    max_predicciones: total,
    predicciones_realizadas: 0,
  };

  return (
    <>
      <div className="flex flex-row gap-x-2 justify-between items-center w-full py-2 bg-white">
        <p className="text-purpleWaki font-medium text-xs">
          {t("prediction.predictionUsed")}
        </p>
        <div className="flex flex-row gap-x-2 items-center">
          {todaysData !== undefined ? (
            <span className="text-xs text-gray-500">
              {t("prediction.today")}
            </span>
          ) : null}
          <div className="flex items-center space-x-1.5">
            {Array.from(
              { length: renderedTodaysData.max_predicciones },
              (_, index) => (
                <div
                  key={index}
                  className={`size-[11px] rounded-full ${
                    index < renderedTodaysData.predicciones_realizadas
                      ? "bg-purpleWaki"
                      : "border border-purpleWaki"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Indicador para las predicciones futuras */}
      <div className="flex flex-row space-x-3 items-center justify-center mx-auto">
        {Object.entries(predictionData || {}).map(([date, data]) => {
          if (
            date !== new Date().toISOString().slice(0, 10) &&
            data.max_predicciones > 0
          ) {
            return (
              <FuturePrediction
                key={date}
                date={date}
                used={data.predicciones_realizadas}
                total={data.max_predicciones}
              />
            );
          }
        })}
      </div>
    </>
  );
};

export default PredictionUsageIndicator;
