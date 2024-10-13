import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/common/components/ui/accordion";
import { useEffect, useState } from "react";
import { fetchData } from "@/api/services/fetchData";
import MatchCardWrapper from "./MatchCardWrapper";
import useAuthStore from '@/api/store/authStore';
import { useTranslation } from "react-i18next";

const LeagueAccordion = ({ league, date }) => {
  const { t } = useTranslation();
  const { accessToken, refreshToken, logout } = useAuthStore();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetchData(
          `search-match/?date=${date}&league=${league.id_league}`,
          "GET",
          null,
          accessToken
        );
        setMatches(response.data.results);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching matches:", err);
        if (err.message === 'Sesión expirada. Por favor inicia sesión nuevamente.') {
          logout();
          setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        } else {
          setError("Hubo un problema al cargar los partidos. Por favor, intenta de nuevo.");
        }
        setLoading(false);
      }
    };

    fetchMatches();
  }, [league.id_league, date, accessToken, refreshToken, logout]);

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
                {league.country}
              </span>
              <span className="text-[#555] text-sm">{league.name}</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-0 lg:p-2">
          {loading ? (
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
            <div className="p-4">
              {matches.map((match) => (
                <MatchCardWrapper key={match.id_fixture} match={match} />
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