import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ChevronRight,
  Search,
  ArrowUpDown,
  BadgeDollarSign,
  Clock,
  Star,
  ChevronFirst,
  Shield,
} from "lucide-react";
import { Input } from "@/common/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { liga1, liga2, liga3 } from "@/common/assets";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/api/store/language-store";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/common/components/ui/pagination";
import { usePlayers, useTokenizablePlayers } from "@/common/hooks/usePlayers";
import { Skeleton } from "@/common/components/ui/skeleton";

export default function FootballPlayersTable() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterBy, setFilterBy] = useState("value");
  const navigate = useNavigate();

  const {
    data: players,
    isLoading: playersLoading,
    isError: playersError,
  } = usePlayers();
  const {
    data: tokenizablePlayers,
    isLoading: tokenizableLoading,
    isError: tokenizableError,
  } = useTokenizablePlayers();

  const isLoading = playersLoading || tokenizableLoading;
  const isError = playersError || tokenizableError;

  const mergedPlayers = useMemo(() => {
    if (!players || !tokenizablePlayers) return [];
    return players.map((player) => {
      const tokenizablePlayer = tokenizablePlayers.find(
        (tp) => tp.id === player.player_id
      );
      return {
        ...player,
        ...tokenizablePlayer,
      };
    });
  }, [players, tokenizablePlayers]);

  const filterOptions = [
    {
      value: "value",
      labelEn: "Value",
      labelEs: "Valor",
      icon: BadgeDollarSign,
    },
    { value: "league", labelEn: "Division", labelEs: "División", icon: Shield },
    {
      value: "minutes",
      labelEn: "Minutes played",
      labelEs: "Minutos jugados",
      icon: Clock,
    },
    { value: "assists", labelEn: "Assists", labelEs: "Asistencia", icon: Star },
    { value: "age", labelEn: "Age", labelEs: "Edad", icon: ChevronFirst },
  ];

  const sortedPlayers = useMemo(() => {
    if (!mergedPlayers) return [];
    return [...mergedPlayers].sort((a, b) => {
      switch (filterBy) {
        case "value":
          return b.price - a.price;
        case "league":
          return (
            (a.category === "Gold" ? 1 : a.category === "Silver" ? 2 : 3) -
            (b.category === "Gold" ? 1 : b.category === "Silver" ? 2 : 3)
          );
        case "minutes":
          return (b.minutes || 0) - (a.minutes || 0);
        case "assists":
          return (b.assists || 0) - (a.assists || 0);
        case "age":
          return (a.age || 0) - (b.age || 0);
        default:
          return 0;
      }
    });
  }, [mergedPlayers, filterBy]);

  const columns = useMemo(
    () => [
      {
        accessorFn: (_, index) => index + 1,
        header: "#",
        size: 50,
        cell: ({ row }) => (
          <div className="font-semibold text-blue-500 text-center">
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: () => <div className="text-left pl-2">{t("table.player")}</div>,
        cell: ({ row }) => {
          const firstName = row.original.player_name.split(" ")[0];
          const firstLastName = row.original.player_last_name.split(" ")[0];
          return (
            <div className="flex items-center justify-start text-left pl-2">
              <span>{`${firstName} ${firstLastName}`}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "division",
        header: "Div.",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <img
              src={
                row.original.category === "Gold"
                  ? liga1
                  : row.original.category === "Silver"
                  ? liga2
                  : liga3
              }
              alt={`Div ${row.original.category}`}
              className="w-6 h-6"
            />
          </div>
        ),
      },
      {
        accessorKey: "released",
        header: () => <div className="text-center">{t("table.released")}</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center text-center">
            <span>{row.original.burned_tokens}</span>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: t("table.price"),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <span className="mr-2">{row.original.price.toFixed(3)}</span>
            <ChevronRight className="w-5 h-5 text-blue-500" />
          </div>
        ),
      },
    ],
    [t]
  );

  const table = useReactTable({
    data: sortedPlayers,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const fullName =
        `${row.original.player_name} ${row.original.player_last_name}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2 p-4">
        <Skeleton className="h-5" />
        <Skeleton className="h-20" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{t("infoMsg.fetchPlayersError")}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium leading-5 text-[#181818]">
        {t("titles.playerRanking")}
      </h2>
      <div className="flex flex-col items-start justify-between my-4">
        <div className="relative w-full max-w-sm mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={
              currentLanguage === "en" ? "Find a player" : "Busca un jugador"
            }
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(String(e.target.value))}
            className="pl-10"
          />
        </div>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-64 max-w-sm border-none shadow-none">
            <SelectValue>
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4 text-purple-500" />
                <span className="mr-2 text-sm">{t("filter.orderBy")}:</span>
                <span className="text-sm text-[#B1B1B1]">
                  {t(`filter.${filterBy}`)}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5}>
            {filterOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="flex items-center"
              >
                <div className="flex flex-row items-center space-x-1">
                  <option.icon className="mr-2 h-4 w-4 text-purpleWaki" />
                  <span>
                    {currentLanguage === "en" ? option.labelEn : option.labelEs}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white rounded-t-[19px] rounded-b-[9px] waki-shadow overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="group cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/players/${row.original.player_id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row items-center justify-between mt-4">
        <Pagination className="flex flex-row items-center justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>
            {table.getPageOptions().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => table.setPageIndex(page)}
                  isActive={page === table.getState().pagination.pageIndex}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="flex flex-row w-full justify-end text-xs text-gray-700">
          {t("table.showing")}{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          -
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          {t("table.of")} {table.getFilteredRowModel().rows.length}
        </div>
      </div>
    </div>
  );
}
