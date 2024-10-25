/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/common/components/ui/progress";
import { fetchData } from "@/api/services/fetchData";
import useUserDataStore from "@/api/store/userStore";
import useAuthStore from "@/api/store/authStore";
import QuestPointsProgressBar from "./QuestPointsProgressBar";
import { logro } from "@/common/assets";

const missions = [
  {
    id: 1,
    description: "Ganá 1 apuesta simple",
    requiredWins: 1,
    type: "simple",
    points: 10,
  },
  {
    id: 2,
    description: "Ganá 1 apuesta combinada",
    requiredWins: 1,
    type: "combinada",
    points: 25,
  },
  {
    id: 3,
    description: "Ganá 3 apuestas simples",
    requiredWins: 3,
    type: "simple",
    points: 45,
  },
  {
    id: 4,
    description: "Ganá 3 apuestas combinadas",
    requiredWins: 3,
    type: "combinada",
    points: 90,
  },
  {
    id: 5,
    description: "Ganá 10 apuestas simples",
    requiredWins: 10,
    type: "simple",
    points: 130,
  },
  {
    id: 6,
    description: "Ganá 10 apuestas combinadas",
    requiredWins: 10,
    type: "combinada",
    points: 300,
  },
];

const Quest = () => {
  const { user } = useUserDataStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: predictions } = useQuery({
    queryKey: ["predictions"],
    queryFn: async () => {
      const response = await fetchData(
        "predictions/",
        "GET",
        null,
        accessToken
      );
      return response.data;
    },
  });


  const missionProgress = useMemo(() => {
    if (!predictions) return {};

    return missions.reduce((acc, mission) => {
      const completedPredictions = predictions.filter(
        (p) => p.status === "ganada" && p.bet_type === mission.type
      ).length;
      acc[mission.id] = Math.min(completedPredictions, mission.requiredWins);
      return acc;
    }, {});
  }, [predictions]);


  return (
    <div className="container mx-auto">
      <QuestPointsProgressBar currentPoints={user?.total_points ?? 0} />

      <h2 className="text-lg font-medium leading-6 mb-4">Logros</h2>
      <div className="w-full mx-auto bg-white rounded-lg waki-shadow overflow-hidden">
        {missions.map((mission) => {
          const completedPredictions = missionProgress[mission.id] || 0;
          return (
            <div
              key={mission.id}
              className="flex flex-row items-center px-2 py-4 border-b last:border-b-0"
            >
              <div className="flex flex-row items-center justify-between space-x-4 w-full">
                <img
                  src={logro}
                  alt="Mission icon"
                  className="object-cover w-8 h-auto"
                />
                <div className="flex flex-col w-full space-y-1">
                  <div className="flex flex-row justify-between items-center gap-x-1">
                    <h3 className="font-normal text-sm leading-4">
                      {mission.description}
                    </h3>
                    <p className="text-xs text-[#555]">{mission.points} puntos</p>
                  </div>

                  <div className="relative">
                    <Progress
                      value={(completedPredictions / mission.requiredWins) * 100}
                      className="h-4"
                    />
                    <div className="absolute left-1/2 top-0 h-full flex items-center">
                      <div className="flex flex-row items-center space-x-2">
                        <span className="text-white text-xs text-center font-medium">
                          {completedPredictions}/{mission.requiredWins}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Quest;