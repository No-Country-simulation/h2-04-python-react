/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/common/components/ui/progress";
import { fetchData } from "@/api/services/fetchData";
import useUserDataStore from "@/api/store/userStore";
import useAuthStore from "@/api/store/authStore";
import QuestPointsProgressBar from "./QuestPointsProgressBar";
import { logro } from "@/common/assets";
import { Skeleton } from "@/common/components/ui/skeleton";
import { useUser } from "@/api/services/useUser";

const missions = [
  {
    id: 1,
    description: "Ganá 1 apuesta simple",
    requiredWins: 1,
    type: "simple",
    points: 10,
    rewardKey: "rewards_single_one",
  },
  {
    id: 2,
    description: "Ganá 1 apuesta combinada",
    requiredWins: 1,
    type: "combinada",
    points: 25,
    rewardKey: "rewards_combined_one",
  },
  {
    id: 3,
    description: "Ganá 3 apuestas simples",
    requiredWins: 3,
    type: "simple",
    points: 45,
    rewardKey: "rewards_single_three",
  },
  {
    id: 4,
    description: "Ganá 3 apuestas combinadas",
    requiredWins: 3,
    type: "combinada",
    points: 90,
    rewardKey: "rewards_combined_three",
  },
  {
    id: 5,
    description: "Ganá 10 apuestas simples",
    requiredWins: 10,
    type: "simple",
    points: 130,
    rewardKey: "rewards_single_ten",
  },
  {
    id: 6,
    description: "Ganá 10 apuestas combinadas",
    requiredWins: 10,
    type: "combinada",
    points: 300,
    rewardKey: "rewards_combined_ten",
  },
];

const Quest = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useUser();

  const {
    data: rewardsData,
    isLoading: isRewardsLoading,
    error: rewardsError,
  } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const response = await fetchData(
        "user/me/rewards/",
        "GET",
        null,
        accessToken
      );
      return response.data;
    },
  });

  if (isUserLoading || isRewardsLoading) {
    return (
      <div>
        <Skeleton className="h-52" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    );
  }

  if (userError || rewardsError) {
    return (
      <div className="text-red-500">
        {userError?.message ||
          rewardsError?.message ||
          "An error occurred. Please try again."}
      </div>
    );
  }
  return (
    <div className="container mx-auto">
      <QuestPointsProgressBar currentPoints={userData?.total_points || 0} />
      
      <h2 className="text-lg font-medium leading-6 mb-4">Logros</h2>
      <div className="w-full mx-auto bg-white rounded-lg waki-shadow overflow-hidden">
        {missions.map((mission) => {
          const [completed, total] = (rewardsData?.[mission.rewardKey] ?? "0/0")
            .split("/")
            .map(Number);
          const progressPercentage = (completed / total) * 100;

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
                    <p className="text-xs text-[#555]">
                      {mission.points} puntos
                    </p>
                  </div>

                  <div className="relative">
                    <Progress value={progressPercentage} className="h-4" />
                    <div className="absolute left-1/2 top-0 h-full flex items-center">
                      <div className="flex flex-row items-center space-x-2">
                        <span className="text-white text-xs text-center font-medium">
                          {completed}/{total}
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
