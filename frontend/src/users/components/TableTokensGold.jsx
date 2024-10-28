import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { ChevronRight, MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { futPlayers } from "../data/footballPlayers";
import { useTranslation } from "react-i18next";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import useLanguageStore from "@/api/store/language-store";
import { useMemo } from "react";

const TableTokensGold = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const filteredPlayers = futPlayers.filter((player) => player.division === 1);
  const navigate = useNavigate();

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
          <div className="flex flex-row items-center space-x-2">
            <img
              src={row.original.image}
              alt={`${row.original.name} ${row.original.lastName}`}
              className="size-7 rounded-full"
            />
            <span>{`${row.original.name} ${row.original.lastName}`}</span>
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
    data: filteredPlayers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg text-[#181818] font-medium my-4">
          {currentLanguage === "en"
            ? "Gold division tokens"
            : "Tokens división oro"}
        </h2>
        <Link to="/players">
          <div className="flex flex-row items-center gap-x-2 text-purpleWaki text-sm font-normal">
            {t("navigation.goToRank")} <MoveRight />
          </div>
        </Link>
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
    </div>
  );
};

export default TableTokensGold;
