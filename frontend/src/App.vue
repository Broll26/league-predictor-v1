<template>
  <div class="app-container">
    <h1>Premier League Predictor</h1>
    <FixtureDisplay />
    <TableDisplay />
  </div>
</template>

<script setup lang="ts">
import FixtureDisplay from "./components/FixtureDisplay.vue";
import TableDisplay from "./components/TableDisplay.vue";
// Import usePredictions to initialize the shared state
import { usePredictions } from "./composables/usePredictions";

// Initialize predictions state
usePredictions();
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
