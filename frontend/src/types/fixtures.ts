export interface Fixture {
  id: number;
  date: Date;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
}

export interface Gameweek {
  roundNumber: number;
  fixtures: Fixture[];
}

export interface FixtureData {
  gameweeks: Gameweek[];
}
