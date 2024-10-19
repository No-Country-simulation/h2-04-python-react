import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import { MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";

const MyPredictions = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { t } = useTranslation();
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
            <span className="font-medium text-6xl text-white">5</span>
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
              <p className="font-normal text-[#555] text-xs pl-5">
                {t("prediction.outPredictions")}
              </p>
              <Button className="bg-purpleWaki hover:bg-purple-700">
              {t("prediction.buyPrediction")}
              </Button>
            </div>
          </div>

          <TabsContent value="All">
            <Card className="bg-white rounded-t-[9px] rounded-b-none min-h-48 shadow-none border-none">
             * aqui va el historial de las predicciones realizadas*
            </Card>
          </TabsContent>
          <TabsContent value="Win">
          <Card className="bg-white rounded-t-[9px] rounded-b-none min-h-48 shadow-none border-none">
             * aqui va el historial solo de las predicciones ganadas*
            </Card>
          </TabsContent>
          <TabsContent value="Loss">
          <Card className="bg-white rounded-t-[9px] rounded-b-none min-h-48 shadow-none border-none">
             * aqui va el historial solo de las predicciones perdidas*
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MyPredictions;
