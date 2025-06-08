export interface Team {
  id: number;
  name: string;
  logo?: string;
}

export interface FixtureDetails {
  id: number;
  date: string;
  timestamp: number;
  venue?: {
    id?: number;
    name?: string;
    city?: string;
  };
}

export interface LeagueInfo {
  id: number;
  name: string;
  country: string;
  round: string;
}

export interface ApiFixture {
  fixture: FixtureDetails;
  league: LeagueInfo;
  teams: {
    home: Team;
    away: Team;
  };
  goals?: {
    home: number | null;
    away: number | null;
  };
}

export interface ApiResponse {
  get: string;
  parameters: {
    league: string;
    season: string;
  };
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: ApiFixture[];
}
