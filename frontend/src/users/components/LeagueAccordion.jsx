/* eslint-disable react/prop-types */
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import MatchCardStatic from "./MatchCardStatic";

const LeagueAccordion = ({ logo, name, country }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 bg-white rounded-t-[9px] rounded-b-[2px]">
      <button
        className="flex justify-between items-center w-full p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <img src={logo} alt={name} className="w-6 h-6 mr-2" />
          <div className="flex flex-row space-x-2 items-center">
            <span className="text-[#181818] font-semibold">{country}</span>
            <span className="text-[#555] text-sm">{name}</span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="size-5 text-blueWaki" />
        ) : (
          <ChevronDown className="size-5 text-blueWaki" />
        )}
      </button>
      {isOpen && (
        <div className="p-4">
          <MatchCardStatic />
        </div>
      )}
    </div>
  );
};

export default LeagueAccordion;
