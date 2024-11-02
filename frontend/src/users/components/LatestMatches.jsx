/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { useMemo, useState } from "react";
import useLanguageStore from "@/api/store/language-store";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/common/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/common/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { useTranslation } from "react-i18next";

const LatestMatches = ({ homeTeam, awayTeam }) => {
  const { currentLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);

  const fetchLatestMatches = async () => {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures/headtohead?h2h=${homeTeam}-${awayTeam}`,
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
    queryKey: ["LatestMatches", homeTeam, awayTeam],
    queryFn: fetchLatestMatches,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vier", "Sab"];
    const day = days[date.getDay()];
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")} `;
    return (
      <div className="flex flex-col justify-center">
        <span>{day}</span> <span>{formattedDate}</span>{" "}
        <span>{date.getFullYear()}</span>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "teams",
        header: () => <div className="pl-2 text-left">{t("table.matches")}</div>,
        cell: ({ row }) => (
          <div className="flex flex-col items-start justify-start gap-2 pl-2">
            <div className="flex flex-row gap-1 items-center">
              <img
                src={row.original.teams.home.logo}
                alt={`Logo de ${row.original.teams.home.name}`}
                width={20}
                height={20}
                className="w-auto h-4"
              />
              <span>{row.original.teams.home.name}</span>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <img
                src={row.original.teams.away.logo}
                alt={`Logo de ${row.original.teams.away.name}`}
                width={20}
                height={20}
                className="w-auto h-4"
              />
              <span>{row.original.teams.away.name}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "result",
        header: () => <div className="text-center">{t("table.results")}</div>,
        cell: ({ row }) => {
          const homeGoals = row.original.goals.home;
          const awayGoals = row.original.goals.away;
          const winner =
            homeGoals > awayGoals
              ? "home"
              : homeGoals < awayGoals
              ? "away"
              : "draw";

          return (
            <div className="flex items-center justify-center">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-center font-medium">{homeGoals}</span>
                  {winner === "home" && (
                    <div
                      className="w-0 h-0 
                      border-t-[4px] border-t-transparent 
                      border-b-[4px] border-b-transparent 
                      border-l-[6px] border-l-blue-500
                      ml-1 rotate-180"
                    />
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-center font-medium">{awayGoals}</span>
                  {winner === "away" && (
                    <div
                      className="w-0 h-0 
                      border-t-[4px] border-t-transparent 
                      border-b-[4px] border-b-transparent 
                      border-l-[6px] border-l-blue-500
                      ml-1 rotate-180"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "date",
        header: () => <div className="text-center">{t("table.day")}</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {formatDate(row.original.fixture.date)}
          </div>
        ),
      },
    ],
    [t]
  );

  const matches = useMemo(() => {
    const sortedMatches = [...(data?.response ?? [])]
      .filter((match) => match.goals.home !== null && match.goals.away !== null)
      .sort(
        (a, b) =>
          new Date(b.fixture.date).getTime() -
          new Date(a.fixture.date).getTime()
      );
    return sortedMatches;
  }, [data]);

  const table = useReactTable({
    data: matches,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: currentPage,
        pageSize: 5,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: currentPage, pageSize: 5 });
        setCurrentPage(newState.pageIndex);
      }
    },
  });

  if (isLoading) return <Skeleton className="p-2 h-96" />;
  if (error) return;
  <Alert variant="destructive">
    <ExclamationTriangleIcon className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>Error al cargar los últimos partidos</AlertDescription>
  </Alert>;

  return (
    <>
      <h2 className="font-medium text-base text-[#181818] leading-6">
        {currentLanguage === "en"
          ? "Latest Matches"
          : "Últimos Enfrentamientos"}
      </h2>
      {matches.length > 0 ? (
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
          <div className="flex items-center justify-between px-4 py-2">
            <Button
              variant="ghots"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-5 text-blueWaki" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentLanguage === "en" ? "Page" : "Página"}{" "}
              {table.getState().pagination.pageIndex + 1}{" "}
              {currentLanguage === "en" ? "of" : "de"} {table.getPageCount()}
            </span>
            <Button
              variant="ghots"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-5  text-blueWaki" />
            </Button>
          </div>
        </div>
      ) : (
        <p>No hay datos de partidos recientes disponibles.</p>
      )}
    </>
  );
};

export default LatestMatches;
