import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { liga1, liga2, liga3 } from "@/common/assets";
import useUserDataStore from "@/api/store/userStore";
import DivisionIcon from "../components/DivisionIcon";
import { users, getDivisionInfo } from "../data/usersData";
import { useTranslation } from "react-i18next";

const DivisionRanking = () => {
  const { t } = useTranslation();
  const { user } = useUserDataStore();
  const currentDivision = getDivisionInfo(user.total_points);

  const divisions = [
    { name: "Bronce", image: liga3 },
    { name: "Plata", image: liga2 },
    { name: "Oro", image: liga1 },
  ];

  const getDivisionStatus = (divisionName) => {
    const divisionIndex = divisions.findIndex(d => d.name === divisionName);
    const currentDivisionIndex = divisions.findIndex(d => d.name === currentDivision);

    if (divisionIndex < currentDivisionIndex) return 'completed';
    if (divisionIndex > currentDivisionIndex) return 'locked';
    return 'current';
  };

  const usersInSameDivision = users.filter(
    (u) => getDivisionInfo(u.points) === currentDivision
  );

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
      <h1 className="text-center font-medium text-lg mb-3">
        División {currentDivision}
      </h1>
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
              <TableRow key={user.id}>
                <TableCell
                  className={`font-semibold text-blue-500 text-center`}
                >
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row space-x-3 items-center">
                    <div className="size-10 rounded-full">
                      <img src={user.avatar} alt="Avatar" />
                    </div>
                    <span>{user.username}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{user.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DivisionRanking;