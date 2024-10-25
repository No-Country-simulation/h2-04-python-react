import { liga1, liga2, liga3 } from "@/common/assets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import {
  ChevronRight,
  Search,
  ArrowUpDown,
  BadgeDollarSign,
  BarChart2,
  ChevronFirst,
  Clock,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { futPlayers } from "../data/footballPlayers";
import { Input } from "@/common/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/common/components/ui/select";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/api/store/language-store";

const FutPlayerRanking = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const filterOptions = [
    { value: "valor", label: "Valor", icon: BadgeDollarSign },
    { value: "liga", label: "Liga", icon: BarChart2 },
    { value: "minutos", label: "Minutos jugados", icon: Clock },
    { value: "asistencia", label: "Asistencia", icon: Star },
    { value: "edad", label: "Edad", icon: ChevronFirst },
  ];

  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);
  const selectedLabel =
    filterOptions.find((option) => option.value === selectedFilter)?.label ||
    "Valor";

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium leading-5 text-[#181818]">
        {t("titles.playerRanking")}
      </h2>
      <div className="relative my-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          name="search"
          placeholder={
            currentLanguage === "en" ? "Find a player" : "Busca un jugador"
          }
          className="pl-12"
          disabled
        />
      </div>
      <div className="mb-4 w-full justify-between">
        <Select
          value={selectedFilter}
          onValueChange={setSelectedFilter}
          disabled
        >
          <SelectTrigger className="w-64 max-w-sm border-none shadow-none">
            <div className="flex items-center">
              <ArrowUpDown className="mr-2 h-4 w-4 text-purple-500" />
              <span className="mr-2 text-sm">Ordenar por:</span>
              <span className="text-sm text-[#B1B1B1]">{selectedLabel}</span>
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
                  <option.icon className="mr-2 h-4 w-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white rounded-t-[19px] rounded-b-[9px] waki-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>{t("table.player")}</TableHead>
              <TableHead className="w-16">Div.</TableHead>
              <TableHead className="w-20 text-center">
                {t("table.released")}
              </TableHead>
              <TableHead className="w-20 text-center">
                {t("table.price")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {futPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell
                  className={`font-semibold text-blue-500 text-center`}
                >
                  {player.id}
                </TableCell>
                <TableCell>
                  <Link
                    to={`/players/${player.id}`}
                    className="hover:underline"
                  >
                    {player.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs`}
                  >
                    <img
                      src={
                        player.division === 1
                          ? liga1
                          : player.division === 2
                          ? liga2
                          : liga3
                      }
                      alt={`Liga ${player.division}`}
                      className="size-6"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">{player.released}</TableCell>
                <TableCell className="text-right">
                  <span className="mr-2">{player.price}</span>
                  <Link to="#">
                    <ChevronRight className="inline size-5 text-blue-500" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FutPlayerRanking;
