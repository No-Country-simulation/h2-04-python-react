import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import FutPlayerRanking from "../components/FutPlayerRanking";
import { useTranslation } from "react-i18next";
import {
  TokenChart,
  TokenDistributionChart,
  YearTokenChart,
} from "../components/TokenChart";
import useLanguageStore from "@/api/store/language-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";

const Players = () => {
  const [activeTab, setActiveTab] = useState("Ranking");
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();

  return (
    <section className="py-4 mb-28">
      <div className="flex justify-center items-center mb-4 p-4 pt-0">
        <h1 className="text-2xl font-bold text-blueWaki flex-1 text-center">
          {t("navigation.scoutPlayers")}
        </h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger
            value="Ranking"
            className="data-[state=active]:text-blueWaki data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
          >
            {t("tabs.ranking")}
          </TabsTrigger>
          <TabsTrigger
            value="Market"
            className="data-[state=active]:text-blueWaki data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
          >
            {t("tabs.market")}
          </TabsTrigger>
          <TabsTrigger
            value="Statistics"
            className="data-[state=active]:text-blueWaki data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
          >
            {t("tabs.statistics")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Ranking">
          <FutPlayerRanking />
        </TabsContent>

        <TabsContent value="Market"></TabsContent>

        <TabsContent value="Statistics">
          <div className="py-5 px-3 flex flex-col gap-4">
          <Select>
            <SelectTrigger className="w-44 max-w-sm border-none shadow-none">
              <SelectValue placeholder={currentLanguage === "en" ? "Select a token" : "Selecciona un token"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="MESSI">MESSI/USDT</SelectItem>
                <SelectItem value="MBAPPE">MBAPPE/USDT</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
            <div className="">
              <h2 className="font-medium text-base text-[#181818] leading-6 mb-2.5">
                {currentLanguage === "en"
                  ? "Annual Cumulative Token Release"
                  : "Liberación Acumulada del Token Anual"}
              </h2>
              <TokenChart lastName={""} />
            </div>

            <div className="">
              <h2 className="font-medium text-base text-[#181818] leading-6 mb-2.5">
                {currentLanguage === "en"
                  ? "Annual Token Release"
                  : "Liberación de Tokens Anual"}
              </h2>
              <YearTokenChart lastName={""} />
            </div>

            <div className="">
              <h2 className="font-medium text-base text-[#181818] leading-6 mb-2.5">
                {currentLanguage === "en"
                  ? "Tokens Released vs. Burned"
                  : "Tokens Liberados vs. Quemados"}
              </h2>
              <TokenDistributionChart />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Players;
