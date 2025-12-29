
export enum AppStatus {
  IDLE = 'IDLE',
  COUNTDOWN = 'COUNTDOWN',
  FUSE = 'FUSE',
  CELEBRATION = 'CELEBRATION'
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}
