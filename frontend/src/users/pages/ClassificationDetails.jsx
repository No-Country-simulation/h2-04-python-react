/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { useMemo } from "react";
import { Skeleton } from "@/common/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { fetchFromAPI } from "@/api/services/fetchApi";

const ClassificationDetails = ({ leagueId, leagueName, leagueLogo }) => {
  const { t } = useTranslation();

  const fetchStandings = async () => {
    try {
      const response = await fetchFromAPI(
        `standings?league=${leagueId}&season=2024`
      );

      return response;
    } catch (error) {
      console.error("Error fetching match details:", error);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["standings", leagueId],
    queryFn: fetchStandings,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "equipo",
        header: () => <div className="text-left pl-2">{t("table.team")}</div>,
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <div className="font-semibold text-blueWaki text-center">
              {row.original.rank}
            </div>
            <img
              src={row.original.team.logo}
              alt={`Logo de ${row.original.team.name}`}
              width={20}
              height={20}
              className="w-auto h-4"
            />
            <span className="font-medium">{row.original.team.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "P",
        header: () => <div className="text-center">P</div>,
        cell: ({ row }) => (
          <div className="text-center">{row.original.all.played}</div>
        ),
      },
      {
        accessorKey: "Goles",
        header: () => <div className="text-center">{t("table.goals")}</div>,
        cell: ({ row }) => (
          <div className="text-center w-auto min-w-12">
            {row.original.all.goals.for} - {row.original.all.goals.against}
          </div>
        ),
      },
      {
        accessorKey: "GD",
        header: () => <div className="text-center">GD</div>,
        cell: ({ row }) => (
          <div
            className={`text-center ${
              row.original.goalsDiff > 0
                ? "text-green-500"
                : row.original.goalsDiff < 0
                ? "text-red-500"
                : ""
            }`}
          >
            {row.original.goalsDiff}
          </div>
        ),
      },
      {
        accessorKey: "Puntos",
        header: () => <div className="text-center">{t("table.points")}</div>,
        cell: ({ row }) => (
          <div className="font-bold text-center">{row.original.points}</div>
        ),
      },
    ],
    [t]
  );

  const standings = useMemo(
    () => data?.response?.[0]?.league?.standings?.[0] ?? [],
    [data]
  );

  const table = useReactTable({
    data: standings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <Skeleton className="p-2 h-96" />;
  if (error)
    return <div>Error al cargar la clasificación: {error.message}</div>;

  return (
    <div className="container mx-auto p-2">
      <div className="flex flex-row items-center gap-x-1 pl-2 mb-3">
        <img
          src={leagueLogo}
          alt={leagueName}
          className="w-auto h-7 object-contain mx-2"
        />
        <h2 className="font-medium text-base text-[#181818] leading-6">
          {leagueName}
        </h2>
      </div>
      {standings.length > 0 ? (
        <div className="bg-white rounded-t-[19px] rounded-b-[9px] waki-shadow overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-[#F3F4F5]">
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>No hay datos de clasificación disponibles.</p>
      )}
    </div>
  );
};

export default ClassificationDetails;
