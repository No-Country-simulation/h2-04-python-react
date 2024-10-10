/* eslint-disable react/prop-types */
import MatchCard from './MatchCard'

export default function MatchCardWrapper({ fixtureData, oddsData }) {
  const isMatchFinished = fixtureData.fixture.status.short === "FT";
  
  let displayData;
  if (isMatchFinished) {
    displayData = {
      type: "result",
      homeTeamGoals: fixtureData.goals.home,
      awayTeamGoals: fixtureData.goals.away,
    };
  } else {
    const odds = oddsData?.bookmakers[0]?.bets[0]?.values.reduce((acc, curr) => {
      if (curr.value === 'Home') acc.home = curr.odd
      if (curr.value === 'Draw') acc.draw = curr.odd
      if (curr.value === 'Away') acc.away = curr.odd
      return acc
    }, {});
    displayData = {
      type: "odds",
      value: odds
    };
  }

  return (
    <MatchCard
      leagueName={fixtureData.league.name}
      leagueLogo={fixtureData.league.logo}
      homeTeam={fixtureData.teams.home}
      awayTeam={fixtureData.teams.away}
      fixtureDate={fixtureData.fixture.date}
      displayData={displayData}
      status={fixtureData.fixture.status}
    />
  )
}