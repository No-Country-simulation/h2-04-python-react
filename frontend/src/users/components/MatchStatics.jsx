import { useParams } from 'react-router-dom'
import { Card} from "@/common/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/common/components/ui/skeleton'
import Statistics from './Statics'
import { useTranslation } from 'react-i18next'

export default function MatchStatistics() {
  const { id: matchId } = useParams()
  const { t } = useTranslation();

  const fetchMatchStatistics = async (matchId) => {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures/statistics?fixture=${matchId}`,
      {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "3340e6dc57da7cc7c941644d11f7ef1c",
        },
      }
    );
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['matchStatistics', matchId],
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
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl bg-[#001829] text-white p-6">
        <p className="text-red-500">{t("infoMsg.errorStatics")}</p>
      </Card>
    )
  }

  return (
    <Statistics data={data} />
  )
}