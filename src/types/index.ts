export interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine: boolean
  flagged: boolean
  adjacentMines: number
}
export enum GameState {
  WAIT,
  GAMING,
  GAME_OVER,
  WIN,
  STOP
}
