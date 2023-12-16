export type Task = {
    task: string;
    point: number;
  };
  export type Plan = {
    day: number;
    plans_today: Task[];
  }
  export type Goal = {
    goal: string;
    goal_points: number;
  };