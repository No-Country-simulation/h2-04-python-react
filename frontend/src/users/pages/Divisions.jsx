import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import RewardsView from "../components/RewardsView";
import DivisionRanking from "./DivisionRanking";

const Divisions = () => {
  const [activeTab, setActiveTab] = useState("Rewards");

  return (
    <section className="p-2 py-4 mb-28">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-blueWaki flex-1 text-center">
          Divisiones
        </h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger
            value="Ranking"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
          >
            Ranking
          </TabsTrigger>
          <TabsTrigger
            value="Rewards"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
          >
            Rewards
          </TabsTrigger>
          <TabsTrigger
            value="Quests"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
            disabled
          >
            Quests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Ranking">
          <DivisionRanking />
        </TabsContent>
        <TabsContent value="Rewards">
          <RewardsView />
        </TabsContent>
        <TabsContent value="Quests">quest</TabsContent>
      </Tabs>
    </section>
  );
};

export default Divisions;
