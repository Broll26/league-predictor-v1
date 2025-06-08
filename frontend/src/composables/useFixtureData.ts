import plFixtureData from "../data/pl2024-25.json";
import type { Fixture } from "../types/fixtures";
import type { ApiResponse } from "../types/apiData";

// For now this is hardcoded to take fixture data from pl2024-25.json, but should genericised later to access data from any season and competition
export function useFixtureData() {
  const parseFixtureData = (): Map<number, Fixture[]> => {
    const gameweekMap = new Map<number, Fixture[]>();

    (plFixtureData as ApiResponse).response.forEach((item) => {
      // Obtain gameweek number
      const roundString = item.league.round;
      const roundMatch = roundString.match(/Regular Season - (\d+)/);
      if (!roundMatch) return;
      const roundNumber = parseInt(roundMatch[1]);

      // Create fixture object
      const fixture: Fixture = {
        id: item.fixture.id,
        date: new Date(item.fixture.date),
        homeTeamId: item.teams.home.id,
        awayTeamId: item.teams.away.id,
        homeTeamName: item.teams.home.name,
        awayTeamName: item.teams.away.name,
      };

      // Add fixture to gameweek map
      if (!gameweekMap.has(roundNumber)) {
        gameweekMap.set(roundNumber, []);
      }
      gameweekMap.get(roundNumber)?.push(fixture);
    });
    return gameweekMap;
  };

  const getOrderedGameweek = (
    gameweekMap: Map<number, Fixture[]>,
    gameweek: number
  ) => {
    const gameweekFixtures = gameweekMap.get(gameweek);
    if (!gameweekFixtures) return;

    // Sort first by date, then by home team name
    return gameweekFixtures.sort((a, b) => {
      const dateComparison = a.date.getTime() - b.date.getTime();
      if (dateComparison === 0) {
        return a.homeTeamName.localeCompare(b.homeTeamName);
      }
      return dateComparison;
    });
  };

  const getTeamFixtures = (
    teamId: number,
    gameweekMap: Map<number, Fixture[]>
  ) => {
    const teamFixtures = new Map<number, Fixture[]>();
    gameweekMap.forEach((fixtures, gameweek) => {
      const teamFixturesForGameweek = fixtures.filter(
        (fixture) =>
          fixture.homeTeamId === teamId || fixture.awayTeamId === teamId
      );
      if (teamFixturesForGameweek.length > 0) {
        teamFixtures.set(gameweek, teamFixturesForGameweek);
      }
    });
    return teamFixtures;
  };

  return {
    parseFixtureData,
    getOrderedGameweek,
    getTeamFixtures,
  };
}
