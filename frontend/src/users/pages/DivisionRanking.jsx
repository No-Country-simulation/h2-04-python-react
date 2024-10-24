import { useQuery } from '@tanstack/react-query';
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
import useAuthStore from '@/api/store/authStore';
import { Skeleton } from '@/common/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { getAllDivisions, getDivisionInfo } from '@/common/utils/division';
import useLanguageStore from '@/api/store/language-store';

const DivisionRanking = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const { user: currentUser } = useUserDataStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  const currentDivision = getDivisionInfo(currentUser.total_points);
  const divisions = getAllDivisions();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetchData('user/', 'GET', null, accessToken);
      if (response.status_code !== 200 || !Array.isArray(response.data)) {
        throw new Error('Invalid data format received from API');
      }
      return response.data
      .filter(user => user && user.total_points && parseFloat(user.total_points) > 0)
      .sort((a, b) => parseFloat(b.total_points) - parseFloat(a.total_points));
    },
    staleTime: 1000 * 60 * 30, 
  });

  const getDivisionStatus = (divisionName) => {
    const divisionIndex = divisions.findIndex(d => d.name === divisionName);
    const currentDivisionIndex = divisions.findIndex(d => d.name === currentDivision.name);

    if (divisionIndex < currentDivisionIndex) return 'completed';
    if (divisionIndex > currentDivisionIndex) return 'locked';
    return 'current';
  };

  const usersInSameDivision = users?.filter(
    (u) => getDivisionInfo(u.total_points).name === currentDivision.name
  ) || [];

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
      {currentLanguage === "en" ? (
          <h1 className="text-center font-medium text-lg mb-3">
            {t(currentDivision.name)} Division
          </h1>
        ) : (
          <h1 className="text-center font-medium text-lg mb-3">
            Division {t(currentDivision.name)}
          </h1>
        )}
      
      <div className="w-auto bg-white rounded-t-[19px] rounded-b-[9px] waki-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>{t('table.username')}</TableHead>
              <TableHead className="text-center">{t('table.points')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersInSameDivision.map((user, index) => (
              <TableRow key={user.id} className={user.id === currentUser?.id ? 'bg-[#C2DAFF]' : ''}>
                <TableCell
                  className="font-semibold text-blue-500 text-center"
                >
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row space-x-3 items-center">
                    <div className="size-10 rounded-full overflow-hidden">
                      <img src={user.profile_image || `https://avatar.iran.liara.run/username?username=${user.full_name}`} alt={`Avatar de ${user.full_name}`} className="w-full h-full object-cover" />
                    </div>
                    <span>{user.id === currentUser.id ? currentLanguage === "en" ? "You" : "Tu" : user.full_name || user.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{parseFloat(user.total_points).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DivisionRanking;