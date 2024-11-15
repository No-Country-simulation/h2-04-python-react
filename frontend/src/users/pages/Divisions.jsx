import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import RewardsView from "../components/RewardsView";
import DivisionRanking from "./DivisionRanking";
import { useTranslation } from "react-i18next";
import Quest from "../components/Quest";
import useTab from "@/common/hooks/useTab";

const Divisions = () => {
  const { activeTab, setActiveTab } = useTab();
  const { t } = useTranslation();

  return (
    <section className="p-2 py-4 mb-28">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-blueWaki flex-1 text-center">
        {t('navigation.divisions')}
        </h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto ">
        <TabsList className="grid w-full grid-cols-3 bg-transparent">
          <TabsTrigger
            value="Ranking"
            className="data-[state=active]:text-blueWaki data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
          >
            {t('tabs.ranking')}
          </TabsTrigger>
          <TabsTrigger
            value="Rewards"
            className="data-[state=active]:text-blueWaki data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
          >
            {t('tabs.rewards')}
          </TabsTrigger>
          <TabsTrigger
            value="Quests"
            className="data-[state=active]:text-blueWaki data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
            
          >
            {t('tabs.quests')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Ranking">
          <DivisionRanking />
        </TabsContent>
        <TabsContent value="Rewards">
          <RewardsView />
        </TabsContent>
        <TabsContent value="Quests">
          <Quest />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Divisions;
