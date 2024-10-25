/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/components/ui/accordion";
import { useEffect } from "react";
import MatchCardWrapper from "./MatchCardWrapper";
import { useTranslation } from "react-i18next";
import { useMatches } from '@/api/services/matches';
import { toast } from 'sonner';

const LeagueAccordion = ({ league, date, onOddsSelect }) => {
  const { t } = useTranslation(); 

  const { data: matches, isLoading, error } = useMatches(league, date);

useEffect(() => {
  if (error) {
    toast.error(error.message);
  }
}, [error]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-white rounded-md shadow-sm"
    >
      <AccordionItem value={league.name}>
        <AccordionTrigger className="px-2 custom-accordion-item">
          <div className="flex items-center w-full">
            <img src={league.logo} alt={league.name} className="size-7 object-contain mx-2" />
            <div className="flex flex-row space-x-2 items-center">
              <span className="text-[#181818] font-semibold">
              {t(`countries.${league.country}`)}
              </span>
              <span className="text-[#555] text-sm">{league.name}</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-0 lg:p-2">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              {t('infoMsg.loadMatch')}
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">Error: {error}</div>
          ) : matches.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {t('infoMsg.infoMatch')}
            </div>
          ) : (
            <div className="p-1 grid md:grid-cols-2 md:gap-1 justify-items-center">
              {matches.map((match) => (
                <MatchCardWrapper key={match.id_fixture} match={match} onOddsSelect={onOddsSelect} />
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

LeagueAccordion.propTypes = {
  league: PropTypes.shape({
    id_league: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired,
  date: PropTypes.string.isRequired,
  accessToken: PropTypes.string.isRequired,
};

export default LeagueAccordion;