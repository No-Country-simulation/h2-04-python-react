import { fetchData } from "@/api/services/fetchData";
import useAuthStore from "@/api/store/authStore";
import { Progress } from "@/common/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Medal, Target, Trophy } from "lucide-react";
import { t } from "i18next";
import { Skeleton } from "@/common/components/ui/skeleton";
import useTab from "@/common/hooks/useTab";
import { Link, useNavigate } from "react-router-dom";

const UserAchievements = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { setActiveTab } = useTab();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setActiveTab("Quests");
    navigate("/divisions");
  };

  const {
    data: rewardsData,
    isLoading,
    error,
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

  if (isLoading) return <Skeleton className="h-44 w-full" />;
  if (error) return <div>Error al cargar los datos</div>;

  const missionTypes = [
    "rewards_single_one",
    "rewards_single_three",
    "rewards_single_ten",
    "rewards_combined_one",
    "rewards_combined_three",
    "rewards_combined_ten",
  ];

  const completedMissions = missionTypes.reduce((total, type) => {
    const [completed] = rewardsData[type].split("/").map(Number);
    return (
      total + (completed === parseInt(rewardsData[type].split("/")[1]) ? 1 : 0)
    );
  }, 0);

  const totalMissions = missionTypes.length;

  const progressPercentage = (completedMissions / totalMissions) * 100;

  return (
    <Link to="/divisions" onClick={handleClick} aria-label="Go to Quests tab">
      <div className="p-4 border-b max-w-sm mx-auto">
        <div className="flex items-center mb-4">
          <Trophy
            strokeWidth={1.5}
            className="w-auto h-6 text-purpleWaki mr-2"
          />
          <p className="text-sm font-medium">{t("profile.achievements")}</p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t("profile.quests")}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {completedMissions}/{totalMissions}
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm">
              {t("profile.pointsEarned")}: {rewardsData.total_points_awarded}
            </span>
          </div>
          <div className="flex items-center">
            <Medal className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm">
              {t("profile.totalPoints")}: {rewardsData.total_points}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserAchievements;
