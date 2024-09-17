export type User = {
  _id: string
  name: string
}

export type Statistic = {
  _id: string
  points: number
  goals: number
  secondAssists: number
  assists: number
  totalAssists: number
  throws: number
  throwCompletions: number
  throwErrors: number
  retentionRate: number
  catches: number
  catchCompletion: number
  catcherErrors: number
  catchPercentage: number
  blocks: number
  gDefensiveErrors: number
  aDefensiveErrors: number
  usageRate: number
  touches: number
}

export type GeneralStatistics = {
  _id: string
  matches: number
  pointsPerMatch: number
  goalsPerMatch: number
  assistsPerMatch: number
  throwsPerMatch: number
  throwErrorsPerMatch: number
  catchesPerMatch: number
  catcherErrorsPerMatch: number
  blocksPerMatch: number
  touchesPerMatch: number
}

export type Player = User & Statistic & GeneralStatistics & {
  subRows?: Player[]
}
export type SingleGamePlayer = User & Statistic

export type TableConfig = {
  columnName: string
  columnType: string
  filterType: string
}