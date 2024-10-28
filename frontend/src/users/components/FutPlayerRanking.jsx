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
  BarChart2,
  Clock,
  Star,
  ChevronFirst,
} from "lucide-react";
import { Input } from "@/common/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
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
import { futPlayers } from "../data/footballPlayers";
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

export default function FootballPlayersTable() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterBy, setFilterBy] = useState("value");
  const navigate = useNavigate();

  const filterOptions = [
    {
      value: "value",
      labelEn: "Value",
      labelEs: "Valor",
      icon: BadgeDollarSign,
    },
    { value: "league", labelEn: "League", labelEs: "Liga", icon: BarChart2 },
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
    return [...futPlayers].sort((a, b) => {
      switch (filterBy) {
        case "value":
          return b.price - a.price;
        case "league":
          return a.division - b.division;
        case "minutes":
          return b.minutesPlayed - a.minutesPlayed;
        case "assists":
          return b.assists - a.assists;
        case "age":
          return a.age - b.age;
        default:
          return 0;
      }
    });
  }, [filterBy]);

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
        header: t("table.player"),
        cell: ({ row }) => (
          <div className="flex items-center justify-start pl-2">
            <span>{`${row.original.name} ${row.original.lastName}`}</span>
          </div>
        ),
      },
      {
        accessorKey: "division",
        header: "Div.",
        size: 50,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <img
              src={
                row.original.division === 1
                  ? liga1
                  : row.original.division === 2
                  ? liga2
                  : liga3
              }
              alt={`Liga ${row.original.division}`}
              className="w-6 h-6"
            />
          </div>
        ),
      },
      {
        accessorKey: "released",
        header: t("table.released"),
        size: 100,
      },
      {
        accessorKey: "price",
        header: t("table.price"),
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <span className="mr-2">{row.original.price}</span>
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
      const fullName = `${row.original.name} ${row.original.lastName}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

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
            <div className="flex items-center">
              <ArrowUpDown className="mr-2 h-4 w-4 text-purple-500" />
              <span className="mr-2 text-sm">{t("filter.orderBy")}:</span>
              <span className="text-sm text-[#B1B1B1]">
                {t(`filter.${filterBy}`)}
              </span>
            </div>
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
                onClick={() => navigate(`/players/${row.original.id}`)}
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
