import { useParams } from "react-router-dom";
import { Card } from "@/common/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/common/components/ui/skeleton";
import Statistics from "./Statics";
import { useTranslation } from "react-i18next";
import { fetchFromAPI } from "@/api/services/fetchApi";

export default function MatchStatistics() {
  const { id: matchId } = useParams();
  const { t } = useTranslation();

  const fetchMatchStatistics = async (matchId) => {
    try {
      const response = await fetchFromAPI(
        `fixtures/statistics?fixture=${matchId}`
      );

      return response;
    } catch (error) {
      console.error("Error fetching match details:", error);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["matchStatistics", matchId],
    queryFn: () => fetchMatchStatistics(matchId),
  });

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl bg-[#001829] text-white p-6">
        <p className="text-red-500">{t("infoMsg.errorStatics")}</p>
      </Card>
    );
  }

  return <Statistics data={data} />;
}
