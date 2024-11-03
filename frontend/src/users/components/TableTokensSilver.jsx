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
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/api/store/language-store";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { usePlayers } from "@/common/hooks/usePlayers";

const TableTokensSilver = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const { data: players, isLoading } = usePlayers();
  const filteredPlayers = players?.filter(
    (player) => player.category === "Silver"
  );
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

        cell: ({ row }) => {
          const firstName = row.original.player_name.split(" ")[0];
          const firstLastName = row.original.player_last_name.split(" ")[0];
          return (
            <div className="flex flex-row items-center">
              <span>{`${firstName} ${firstLastName}`}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "released",
        header: () => <div className="text-center">{t("table.released")}</div>,
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center text-center">
              <span>{row.original.burned_tokens}</span>
            </div>
          );
        },
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
            ? "Silver division tokens"
            : "Tokens división plata"}
        </h2>
        <Link to="/players">
          <div className="flex flex-row items-center gap-x-2 text-purpleWaki text-sm font-normal">
            {t("navigation.goToRank")}
            <MoveRight />
          </div>
        </Link>
      </div>
      <div className="bg-white rounded-t-[19px] rounded-b-[9px] waki-shadow overflow-hidden">
        {isLoading ? (
          <p className="px-5 py-2">{currentLanguage === "en" ? "Loading..." : "Cargando..."}</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default TableTokensSilver;
