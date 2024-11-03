import { usePredictions } from "@/api/services/predictions";
import { Skeleton } from "@/common/components/ui/skeleton";
import { t } from "i18next";
import { CheckCircle, Sparkles, XCircle } from "lucide-react";

const PredictionStats = () => {
  const { data: wonPredictions, isLoading: isWonLoading } =
    usePredictions("ganada");
  const { data: lostPredictions, isLoading: isLostLoading } =
    usePredictions("perdida");

  const isLoading = isWonLoading || isLostLoading;

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  const wonCount = wonPredictions?.length || 0;
  const lostCount = lostPredictions?.length || 0;

  return (
    <div className="p-4 border-b max-w-sm mx-auto">
      <div className="flex items-center mb-4">
        <Sparkles strokeWidth={1.5} className="text-purpleWaki size-6 mr-2" />
        <p className="text-sm font-medium ">{t("profile.myPredictions")}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-sm">{t("profile.wonPredictions")}: {wonCount} </span>
        </div>
        <div className="flex items-center">
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-sm">{t("profile.lossPredictions")}: {lostCount} </span>
        </div>
      </div>

      <span className="text-[#555] text-xs">
      {t("profile.click")}
      </span>
    </div>
  );
};

export default PredictionStats;
