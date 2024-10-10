/* eslint-disable react/prop-types */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/components/ui/accordion";
import MatchCardStatic from "./MatchCardStatic";

const LeagueAccordion = ({ logo, name, country }) => {
  return (
    <Accordion type="single" collapsible className="w-full bg-white rounded-md shadow-sm">
      <AccordionItem value={name}>
        <AccordionTrigger className="px-2 custom-accordion-item">
          <div className="flex items-center w-full">
            <img src={logo} alt={name} className="size-7 mx-2" />
            <div className="flex flex-row space-x-2 items-center">
              <span className="text-[#181818] font-semibold">{country}</span>
              <span className="text-[#555] text-sm">{name}</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <MatchCardStatic />
          <MatchCardStatic />
          <MatchCardStatic />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default LeagueAccordion;
