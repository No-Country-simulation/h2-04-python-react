import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/common/components/ui/button";
import PredictionsHistory from "../components/PredictionsHistory";
import { format } from "date-fns";
import { useLimiteDiario } from "@/api/services/predictions";

const MyPredictions = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { t } = useTranslation();
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const { predictionData } = useLimiteDiario([today]);

  const availablePredictions =
    predictionData?.[today]?.predicciones_disponibles || 0;

  return (
    <section className="pb-4 items-center">
      <div className="header waki-gradient">
        <div className="p-2">
          <Link to="/matches">
            <div className="p-4 flex flex-row items-center gap-x-2 text-white text-sm font-normal">
              <MoveLeft /> {t("navigation.matches")}
            </div>
          </Link>
          <div className="flex flex-col justify-center items-center gap-2.5 px-12 pb-3">
            <h1 className="text-white text-2xl font-semibold">
              {t("prediction.yourPredictions")}
            </h1>
            <span className="font-medium text-6xl text-white">
              {availablePredictions}
            </span>
            <p className="font-normal text-base text-white/75">
              {t("prediction.availablePredictions")}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="grid w-full grid-cols-3 bg-transparent">
            <TabsTrigger
              value="All"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:rounded-none data-[state=inactive]:text-white/65 data-[state=inactive]:font-normal data-[state=active]:font-medium data-[state=active]:text-white"
            >
              {t("prediction.all")}
            </TabsTrigger>
            <TabsTrigger
              value="Win"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:rounded-none data-[state=inactive]:text-white/65 data-[state=inactive]:font-normal data-[state=active]:font-medium data-[state=active]:text-white"
            >
              {t("prediction.win")}
            </TabsTrigger>
            <TabsTrigger
              value="Loss"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:rounded-none data-[state=inactive]:text-white/65 data-[state=inactive]:font-normal data-[state=active]:font-medium data-[state=active]:text-white"
            >
              {t("prediction.loss")}
            </TabsTrigger>
          </TabsList>

          <div className="w-full p-5">
            <div className="m-auto max-w-sm h-12 rounded-[9px] bg-white p-1.5 flex flex-row items-center justify-between">
              <p className="font-normal text-[#555] text-xs pl-3">
                {t("prediction.outPredictions")}
              </p>
              <Link to="/profile/buy-predictions">
                <Button className="bg-purpleWaki hover:bg-purple-700">
                  {t("prediction.buyPrediction")}
                </Button>
              </Link>
            </div>
          </div>

          <PredictionsHistory activeTab={activeTab} />
        </Tabs>
      </div>
    </section>
  );
};

export default MyPredictions;
