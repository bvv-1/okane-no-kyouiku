export type Task = {
  name: string
  point: number
}

export type Plan = {
  day: number
  tasks_today: Task[]
}

export type Goal = {
  goal: string
  goal_points: number
}
