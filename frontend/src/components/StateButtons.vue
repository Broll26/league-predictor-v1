<template>
  <div class="state-buttons">
    <button class="action-button" @click="toggleTableVisibility">
      {{ modelValue.isTableVisible ? "Hide Table" : "Show Table" }}
    </button>
    <button class="action-button clear-button" @click="clearPredictions">
      Clear All Predictions
    </button>
  </div>
</template>

<script setup lang="ts">
import { usePredictions } from "../composables/usePredictions";

// Define the display state interface
interface DisplayState {
  isTableVisible: boolean;
}

// Define props and emits for v-model
const props = defineProps<{
  modelValue: DisplayState;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: DisplayState];
}>();

const { clearPredictions } = usePredictions();

// Function to toggle table visibility
const toggleTableVisibility = () => {
  emit("update:modelValue", {
    ...props.modelValue,
    isTableVisible: !props.modelValue.isTableVisible,
  });
};
</script>

<style scoped>
.state-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}

.action-button {
  padding: 0.5rem 1rem;
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #e6e6e6;
}

.clear-button {
  background-color: #fff0f0;
  border-color: #ffcccc;
}

.clear-button:hover {
  background-color: #ffe6e6;
}
</style>
