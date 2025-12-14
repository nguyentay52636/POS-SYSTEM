export interface PointsConfig {
  points: number
  amount: number
  minPoints: number
  maxPoints: number
  enableExpiry: boolean
  expiryDays: number
  enableBonus: boolean
  bonusMultiplier: number
}

export interface ConfigHistory {
  id: string
  date: string
  points: number
  amount: number
  changedBy: string
}

export const DEFAULT_CONFIG: PointsConfig = {
  points: 100,
  amount: 10000,
  minPoints: 10,
  maxPoints: 10000,
  enableExpiry: false,
  expiryDays: 365,
  enableBonus: false,
  bonusMultiplier: 1.5,
}

export const EXAMPLE_POINTS = [50, 100, 500, 1000]

