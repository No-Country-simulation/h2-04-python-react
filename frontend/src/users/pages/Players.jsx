import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import FutPlayerRanking from "../components/FutPlayerRanking";

const Players = () => {
  const [activeTab, setActiveTab] = useState("Ranking");

  return (
    <section className="py-4 mb-28">
      <div className="flex justify-center items-center mb-4 p-4 pt-0">
        <h1 className="text-2xl font-bold text-blueWaki flex-1 text-center">
          Scout Players
        </h1>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white">
          <TabsTrigger
            value="Ranking"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
          >
            Ranking
          </TabsTrigger>
          <TabsTrigger
            value="Market"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
            disabled
          >
            Market
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Ranking">
          <FutPlayerRanking />
        </TabsContent>
  
      </Tabs>
    </section>
  );
};

export default Players;
