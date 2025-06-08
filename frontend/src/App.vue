<template>
  <div class="app-container">
    <FixtureDisplay />
    <StateButtons v-model="displayState" />
    <TableDisplay v-if="displayState.isTableVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FixtureDisplay from "./components/FixtureDisplay.vue";
import TableDisplay from "./components/TableDisplay.vue";
import StateButtons from "./components/StateButtons.vue";
import { usePredictions } from "./composables/usePredictions";

// Initialize predictions state
usePredictions();

// Define the display state
interface DisplayState {
  isTableVisible: boolean;
}

// Create reactive display state
const displayState = ref<DisplayState>({
  isTableVisible: true,
});
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
