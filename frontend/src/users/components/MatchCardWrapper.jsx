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

const MatchCardWrapper = ({ match, onOddsSelect }) => {
  const matchStatus = parseMatchStatus(match.match_status);
  const isMatchLive = ["1H", "HT", "2H", "ET", "P", "SUSP", "INT"].includes(
    matchStatus.short);
  const isMatchFinished = ["FT", "AET", "PEN"].includes(matchStatus.short);


  let displayData;
  if (isMatchFinished || isMatchLive) {
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
      oddsAvailable: odds.home !== null && odds.home > 0.00 &&
               odds.draw !== null && odds.draw > 0.00 &&
               odds.away !== null && odds.away > 0.00
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
      onOddsSelect={onOddsSelect}
      matchId={match.id_fixture}
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
  onOddsSelect: PropTypes.func.isRequired,
};

export default MatchCardWrapper