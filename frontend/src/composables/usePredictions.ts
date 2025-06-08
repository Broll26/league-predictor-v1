import { ref, computed } from "vue";
import { useFixtureData } from "./useFixtureData";

export interface Prediction {
  fixtureId: number;
  homeScore: number | null;
  awayScore: number | null;
}

export interface TeamStats {
  teamId: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  goalDifference: number;
}

// Create a singleton instance to ensure state is shared
let predictionsInstance: ReturnType<typeof createPredictions> | null = null;

function createPredictions() {
  // Store predictions in a Map with fixture ID as key
  const predictions = ref<Map<number, Prediction>>(new Map());

  // Get fixture data
  const { parseFixtureData } = useFixtureData();
  const gameweekMap = parseFixtureData();

  // Set a prediction for a fixture
  const setPrediction = (
    fixtureId: number,
    homeScore: number | null,
    awayScore: number | null
  ) => {
    // If both scores are null, we could optionally remove the prediction entirely
    // But for now we'll just update it with null values
    predictions.value.set(fixtureId, {
      fixtureId,
      homeScore,
      awayScore,
    });

    // Force reactivity update by creating a new Map
    predictions.value = new Map(predictions.value);
  };

  // Get a prediction for a fixture
  const getPrediction = (fixtureId: number): Prediction | undefined => {
    return predictions.value.get(fixtureId);
  };

  // Check if a prediction is complete (both scores entered)
  const isPredictionComplete = (fixtureId: number): boolean => {
    const prediction = predictions.value.get(fixtureId);
    return (
      !!prediction &&
      prediction.homeScore !== null &&
      prediction.awayScore !== null
    );
  };

  // Helper function to initialize all teams from fixture data
  const getAllTeams = (): Map<number, TeamStats> => {
    const teams = new Map<number, TeamStats>();

    // Process all fixtures to extract unique teams
    gameweekMap.forEach((fixtures) => {
      fixtures.forEach((fixture) => {
        // Add home team if not already in the map
        if (!teams.has(fixture.homeTeamId)) {
          teams.set(fixture.homeTeamId, {
            teamId: fixture.homeTeamId,
            teamName: fixture.homeTeamName,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0,
            goalDifference: 0,
          });
        }

        // Add away team if not already in the map
        if (!teams.has(fixture.awayTeamId)) {
          teams.set(fixture.awayTeamId, {
            teamId: fixture.awayTeamId,
            teamName: fixture.awayTeamName,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0,
            goalDifference: 0,
          });
        }
      });
    });

    return teams;
  };

  // Calculate the league table based on predictions
  const leagueTable = computed<TeamStats[]>(() => {
    // Initialize all teams with zero stats
    const teamStatsMap = getAllTeams();

    // Process all fixtures with complete predictions
    gameweekMap.forEach((fixtures) => {
      fixtures.forEach((fixture) => {
        const prediction = predictions.value.get(fixture.id);

        // Skip fixtures without complete predictions
        // Both scores must be non-null to count the match
        if (
          !prediction ||
          prediction.homeScore === null ||
          prediction.awayScore === null
        ) {
          return;
        }

        const homeTeamStats = teamStatsMap.get(fixture.homeTeamId)!;
        const awayTeamStats = teamStatsMap.get(fixture.awayTeamId)!;

        // Update games played
        homeTeamStats.played++;
        awayTeamStats.played++;

        // Update goals
        homeTeamStats.goalsFor += prediction.homeScore;
        homeTeamStats.goalsAgainst += prediction.awayScore;
        awayTeamStats.goalsFor += prediction.awayScore;
        awayTeamStats.goalsAgainst += prediction.homeScore;

        // Update goal difference
        homeTeamStats.goalDifference =
          homeTeamStats.goalsFor - homeTeamStats.goalsAgainst;
        awayTeamStats.goalDifference =
          awayTeamStats.goalsFor - awayTeamStats.goalsAgainst;

        // Update results and points
        if (prediction.homeScore > prediction.awayScore) {
          // Home win
          homeTeamStats.won++;
          homeTeamStats.points += 3;
          awayTeamStats.lost++;
        } else if (prediction.homeScore < prediction.awayScore) {
          // Away win
          homeTeamStats.lost++;
          awayTeamStats.won++;
          awayTeamStats.points += 3;
        } else {
          // Draw
          homeTeamStats.drawn++;
          homeTeamStats.points += 1;
          awayTeamStats.drawn++;
          awayTeamStats.points += 1;
        }
      });
    });

    // Convert map to array and sort
    return Array.from(teamStatsMap.values()).sort((a, b) => {
      // Sort by points (descending)
      if (a.points !== b.points) {
        return b.points - a.points;
      }

      // Then by goal difference (descending)
      if (a.goalDifference !== b.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }

      // Then by goals for (descending)
      if (a.goalsFor !== b.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }

      // Finally by team name (alphabetically)
      return a.teamName.localeCompare(b.teamName);
    });
  });

  const clearPredictions = () => {
    // Clear all predictions by creating a new empty Map
    predictions.value = new Map();
  };

  return {
    predictions,
    setPrediction,
    getPrediction,
    isPredictionComplete,
    leagueTable,
    clearPredictions,
  };
}

export function usePredictions() {
  if (!predictionsInstance) {
    predictionsInstance = createPredictions();
  }
  return predictionsInstance;
}
