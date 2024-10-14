import PropTypes from 'prop-types';
import MatchCard from "./MatchCard";

const parseMatchStatus = (statusString) => {
  try {
    const jsonString = statusString
      .replace(/'/g, '"')
      .replace(/None/g, "null");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing match status:", error);
    return { long: "Unknown", short: "UNK", elapsed: null, extra: null };
  }
};

const MatchCardWrapper = ({ match }) => {
  const matchStatus = parseMatchStatus(match.match_status);
  const isMatchFinished = matchStatus.short === "FT";

  let displayData;
  if (isMatchFinished) {
    displayData = {
      type: "result",
      homeTeamGoals: match.home_team_goals,
      awayTeamGoals: match.away_team_goals,
    };
  } else {
    const odds = {
      home: match.home_odds,
      draw: match.draw_odds,
      away: match.away_odds,
    };
    displayData = {
      type: "odds",
      value: odds,
    };
  }

  return (
    <MatchCard
      leagueName={match.league.name}
      leagueLogo={match.league.logo}
      homeTeam={{
        name: match.home_team,
        logo: match.home_team_logo,
      }}
      awayTeam={{
        name: match.away_team,
        logo: match.away_team_logo,
      }}
      fixtureDate={match.date}
      displayData={displayData}
      status={matchStatus}
    />
  );
}

MatchCardWrapper.propTypes = {
  match: PropTypes.shape({
    id_fixture: PropTypes.number.isRequired,
    league: PropTypes.shape({
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
    }).isRequired,
    home_team: PropTypes.string.isRequired,
    home_team_logo: PropTypes.string.isRequired,
    away_team: PropTypes.string.isRequired,
    away_team_logo: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    home_team_goals: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    away_team_goals: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    match_status: PropTypes.string,
    home_odds: PropTypes.string,
    draw_odds: PropTypes.string,
    away_odds: PropTypes.string,
  }).isRequired,
};

export default MatchCardWrapper