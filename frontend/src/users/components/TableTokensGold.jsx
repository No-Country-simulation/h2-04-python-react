import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { ChevronRight, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { tokenDivision } from "../data/footballPlayers";

const TableTokensGold = () => {
  const filteredPlayers = tokenDivision.filter(player => player.division === 1);
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg text-[#181818] font-medium my-4">
          Tokens división Oro
        </h2>
        <Link to="/players">
          <div className="flex flex-row items-center gap-x-2 text-purpleWaki text-sm font-normal">
            Ir al ranking <MoveRight />
          </div>
        </Link>
      </div>
      <div className="bg-white rounded-t-[19px] rounded-b-[9px] waki-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead className="w-20 text-center">Released</TableHead>
              <TableHead className="w-20 text-center">Precio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player, index) => (
              <TableRow key={player.id}>
                <TableCell
                  className={`font-semibold text-blue-500 text-center`}
                >
                  {index + 1}
                </TableCell>
                <TableCell>{player.name}</TableCell>

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

export default TableTokensGold;
