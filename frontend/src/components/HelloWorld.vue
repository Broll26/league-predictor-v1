<template>
  <div>Stuff</div>
  <div>
    <button @click="ping">Ping from Electron</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useElectron } from "@/composables/useElectron";

const { ping } = useElectron();

defineProps<{ msg: string }>();
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
