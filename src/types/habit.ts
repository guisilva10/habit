export interface Habit {
  id: string
  name: string
  description: string
  color: string
  streak: number
  completedToday: boolean
  completedDates: string[]
  createdAt: string
}