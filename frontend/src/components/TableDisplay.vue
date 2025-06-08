<template>
  <div class="table-container">
    <!-- <h2>Premier League Table</h2> -->
    <table class="league-table">
      <thead>
        <tr>
          <th>Pos</th>
          <th class="team-name">Team</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>GD</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(team, index) in leagueTable" :key="team.teamId">
          <td>{{ index + 1 }}</td>
          <td class="team-name">{{ team.teamName }}</td>
          <td>{{ team.played }}</td>
          <td>{{ team.won }}</td>
          <td>{{ team.drawn }}</td>
          <td>{{ team.lost }}</td>
          <td>{{ team.goalsFor }}</td>
          <td>{{ team.goalsAgainst }}</td>
          <td>{{ team.goalDifference }}</td>
          <td class="points">{{ team.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { usePredictions } from "../composables/usePredictions";

const { leagueTable } = usePredictions();
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin: 0.5rem;
}

.league-table {
  border-collapse: collapse;
  width: 100%;
  max-width: 800px;
}

.league-table th,
.league-table td {
  padding: 0.5rem;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.league-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.team-name {
  text-align: left;
  min-width: 200px;
}

.points {
  font-weight: bold;
}

.league-table tbody tr:hover {
  background-color: #f5f5f5;
}
</style>
