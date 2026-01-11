export const APP_CONFIG = {
  WATER_GOAL_ML: 3000,
  CUP_SIZE_ML: 250,
  POMODORO_TIME_MINUTES: 25,
};

export const calculatePercentage = (current: number, total: number) => {
  return Math.min(Math.round((current / total) * 100), 100);
};