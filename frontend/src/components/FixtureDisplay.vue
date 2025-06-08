<template>
  <div class="fixture-table-section">
    <div class="fixture-table">
      <div
        class="fixture-row"
        v-for="fixture in orderedFixtures"
        :key="fixture.id"
      >
        <div class="home-team">{{ fixture.homeTeamName }}</div>
        <input
          type="number"
          min="0"
          v-model.number="fixtureScores[fixture.id].homeScore"
          @input="updatePrediction(fixture.id)"
        />
        <div class="centre-column">-</div>
        <input
          type="number"
          min="0"
          v-model.number="fixtureScores[fixture.id].awayScore"
          @input="updatePrediction(fixture.id)"
        />
        <div class="away-team">{{ fixture.awayTeamName }}</div>
      </div>
    </div>
  </div>
  <div class="page-selector">
    <div></div>
    <button @click="selectedGameweek--" :disabled="selectedGameweek <= 1">
      <
    </button>
    <div class="centre-column">
      {{ selectedGameweek }}
    </div>
    <button
      @click="selectedGameweek++"
      :disabled="selectedGameweek >= maxGameweek"
    >
      >
    </button>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive, watch } from "vue";
import type { Fixture } from "../types/fixtures";
import { useFixtureData } from "../composables/useFixtureData";
import { usePredictions } from "../composables/usePredictions";

const selectedGameweek = ref(1);
const { parseFixtureData, getOrderedGameweek } = useFixtureData();
const gameweekMap = parseFixtureData();
const { setPrediction, getPrediction, predictions } = usePredictions();

// Track scores for all fixtures
const fixtureScores = reactive<
  Record<
    number,
    { homeScore: number | "" | null; awayScore: number | "" | null }
  >
>({});

// Watch for changes in the predictions Map
watch(
  predictions,
  () => {
    // Update fixtureScores when predictions change (e.g., when cleared)
    gameweekMap.forEach((fixtures) => {
      fixtures.forEach((fixture) => {
        const prediction = getPrediction(fixture.id);
        if (fixtureScores[fixture.id]) {
          fixtureScores[fixture.id] = {
            homeScore:
              prediction && prediction?.homeScore !== null
                ? prediction.homeScore
                : null,
            awayScore:
              prediction && prediction?.awayScore !== null
                ? prediction.awayScore
                : null,
          };
        }
      });
    });
  },
  { deep: true }
);

// Get the maximum gameweek number for pagination limits
const maxGameweek = computed(() => {
  return Math.max(...Array.from(gameweekMap.keys()));
});

// Use getOrderedGameweek to get fixtures sorted by date and then by home team name
const orderedFixtures = computed<Fixture[]>(() => {
  const fixtures = getOrderedGameweek(gameweekMap, selectedGameweek.value);

  // Initialize score inputs for each fixture
  if (fixtures) {
    fixtures.forEach((fixture) => {
      if (!fixtureScores[fixture.id]) {
        const prediction = getPrediction(fixture.id);
        fixtureScores[fixture.id] = {
          homeScore: prediction?.homeScore ?? null,
          awayScore: prediction?.awayScore ?? null,
        };
      }
    });
  }

  return fixtures || [];
});

// Update prediction when scores change
const updatePrediction = (fixtureId: number) => {
  const scores = fixtureScores[fixtureId];

  // Handle empty inputs - convert empty string or NaN to null
  const homeScore =
    scores.homeScore === null ||
    scores.homeScore === "" ||
    isNaN(scores.homeScore)
      ? null
      : scores.homeScore;
  const awayScore =
    scores.awayScore === null ||
    scores.awayScore === "" ||
    isNaN(scores.awayScore)
      ? null
      : scores.awayScore;

  // Update the prediction
  setPrediction(fixtureId, homeScore, awayScore);
};

// Initialize fixture scores from existing predictions
onMounted(() => {
  // Initialize all fixtures in the gameweek map
  gameweekMap.forEach((fixtures) => {
    fixtures.forEach((fixture) => {
      const prediction = getPrediction(fixture.id);
      fixtureScores[fixture.id] = {
        homeScore: prediction?.homeScore ?? null,
        awayScore: prediction?.awayScore ?? null,
      };
    });
  });
});

// When gameweek changes, ensure all fixtures have score inputs initialized
watch(selectedGameweek, () => {
  const fixtures = getOrderedGameweek(gameweekMap, selectedGameweek.value);
  if (fixtures) {
    fixtures.forEach((fixture) => {
      if (!fixtureScores[fixture.id]) {
        const prediction = getPrediction(fixture.id);
        fixtureScores[fixture.id] = {
          homeScore: prediction?.homeScore ?? null,
          awayScore: prediction?.awayScore ?? null,
        };
      }
    });
  }
});
</script>

<style scoped>
.fixture-table-section {
  display: flex;
  justify-content: center;
}

.fixture-table {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

.fixture-row {
  display: grid;
  grid-template-columns: 1fr 2rem 0.5rem 2rem 1fr;
  gap: 0.5rem;
}

.home-team {
  text-align: right;
}

.centre-column {
  text-align: center;
}

.away-team {
  text-align: left;
}

.page-selector {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1.5rem 1rem 1.5rem 1fr;
  gap: 0.5rem;
}

input[type="number"] {
  width: 100%;
  text-align: center;
}
</style>
