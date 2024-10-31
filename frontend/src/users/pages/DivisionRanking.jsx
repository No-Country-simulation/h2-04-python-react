import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import useUserDataStore from "@/api/store/userStore";
import DivisionIcon from "../components/DivisionIcon";
import { useTranslation } from "react-i18next";
import { fetchData } from "@/api/services/fetchData";
import { AlertCircle } from "lucide-react";
import useAuthStore from "@/api/store/authStore";
import { Skeleton } from "@/common/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/common/components/ui/alert";
import { useDivisionThresholds } from "@/api/services/useDivision";
import useLanguageStore from "@/api/store/language-store";
import { liga1, liga2, liga3, locked } from "@/common/assets";

const DivisionRanking = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const { user: currentUser } = useUserDataStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  // Obtener datos de divisiones usando el hook
  const { data: divisionThresholds, isLoading: isDivisionsLoading } =
    useDivisionThresholds();

  // Obtener usuarios
  const {
    data: users,
    isLoading: isUsersLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetchData("user/", "GET", null, accessToken);
      if (response.status_code !== 200 || !Array.isArray(response.data)) {
        throw new Error("Invalid data format received from API");
      }
      return response.data
        .filter(
          (user) =>
            user && user.total_points && parseFloat(user.total_points) > 0
        )
        .sort(
          (a, b) => parseFloat(b.total_points) - parseFloat(a.total_points)
        );
    },
    staleTime: 1000 * 60 * 30,
  });

  const getDivisionInfo = (points, divisions) => {
    if (!divisions)
      return { name: "loading", image: null, threshold: 0, maxPoints: 0 };

    if (points === 0)
      return { name: "none", image: locked, threshold: 0, maxPoints: 0 };

    const sortedDivisions = [...divisions].sort(
      (a, b) => b.threshold - a.threshold
    );
    for (const division of sortedDivisions) {
      if (points >= division.threshold) {
        const divisionImage = {
          bronze: liga3,
          silver: liga2,
          gold: liga1,
        }[division.name];

        return {
          ...division,
          image: divisionImage,
          nextLevel:
            sortedDivisions[sortedDivisions.indexOf(division) - 1]?.name ||
            null,
        };
      }
    }
    return {
      ...sortedDivisions[sortedDivisions.length - 1],
      image: liga3,
      nextLevel: "silver",
    };
  };

  const isLoading = isUsersLoading || isDivisionsLoading;

  if (isLoading) {
    return (
      <div className="px-4 max-w-md mx-auto space-y-4">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-4 mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const currentDivision = getDivisionInfo(
    currentUser.total_points,
    divisionThresholds
  );

  const divisions =
    divisionThresholds?.map((div) => ({
      name: div.name,
      image: {
        bronze: liga3,
        silver: liga2,
        gold: liga1,
        none: locked,
      }[div.name],
    })) || [];

  const getDivisionStatus = (divisionName) => {
    const divisionIndex = divisions.findIndex((d) => d.name === divisionName);
    const currentDivisionIndex = divisions.findIndex(
      (d) => d.name === currentDivision.name
    );

    if (currentUser.total_points === 0) return "locked";
    if (divisionIndex < currentDivisionIndex) return "completed";
    if (divisionIndex > currentDivisionIndex) return "locked";
    return "current";
  };

  const usersInSameDivision =
    users?.filter(
      (u) =>
        getDivisionInfo(u.total_points, divisionThresholds).name ===
        currentDivision.name
    ) || [];

  return (
    <div className="px-4 max-w-md mx-auto">
      <div className="flex flex-row space-x-16 items-center justify-center h-36 px-2">
        {divisions.map((division) => (
          <DivisionIcon
            key={division.name}
            src={division.image}
            alt={`Division ${division.name}`}
            status={getDivisionStatus(division.name)}
          />
        ))}
      </div>
      {currentUser.total_points > 0 && (
        <h1 className="text-center font-medium text-lg mb-3">
          {currentLanguage === "en"
            ? `${t(currentDivision.name)} Division`
            : `Division ${t(currentDivision.name)}`}
        </h1>
      )}

      <div className="w-auto bg-white rounded-t-[19px] rounded-b-[9px] waki-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>{t("table.username")}</TableHead>
              <TableHead className="text-center">{t("table.points")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUser.total_points === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  {currentLanguage === "en"
                    ? "Start earning points to participate in the ranking"
                    : "Comienza a ganar puntos para participar en el ranking"}
                </TableCell>
              </TableRow>
            ) : (
              usersInSameDivision.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={user.id === currentUser?.id ? "bg-[#C2DAFF]" : ""}
                >
                  <TableCell className="font-semibold text-blue-500 text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row space-x-3 items-center">
                      <div className="size-10 rounded-full overflow-hidden">
                        <img
                          src={
                            user.profile_image ||
                            `https://avatar.iran.liara.run/username?username=${user.full_name}`
                          }
                          alt={`Avatar de ${user.full_name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>
                        {user.id === currentUser.id
                          ? currentLanguage === "en"
                            ? "You"
                            : "Tu"
                          : user.full_name || user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {parseFloat(user.total_points).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DivisionRanking;
