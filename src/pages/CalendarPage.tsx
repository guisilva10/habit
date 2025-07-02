import { useState, useEffect } from 'react'
import HabitCalendar from '../components/HabitCalendar'
import type { Habit } from '../types/habit'
import { calculateStreak } from '../utils/habitUtils'

export default function CalendarPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showNewHabitForm, setShowNewHabitForm] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    color: '#8b5cf6'
  })

  const colors = [
    '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#84cc16', '#f97316', '#ec4899'
  ]

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits')
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
  }, [])

  const saveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits)
    localStorage.setItem('habits', JSON.stringify(updatedHabits))
  }

  const handleToggleHabit = (habitId: string, date: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(date)
        
        if (isCompleted) {
          const newCompletedDates = habit.completedDates.filter(d => d !== date)
          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: calculateStreak(newCompletedDates)
          }
        } else {
          const newCompletedDates = [...habit.completedDates, date].sort()
          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: calculateStreak(newCompletedDates)
          }
        }
      }
      return habit
    })
    
    saveHabits(updatedHabits)
  }

  const handleAddHabit = () => {
    if (!newHabit.name.trim()) {
      setShowNewHabitForm(true)
      return
    }

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      color: newHabit.color,
      streak: 0,
      completedToday: false,
      completedDates: [],
      createdAt: new Date().toISOString()
    }

    saveHabits([...habits, habit])
    setNewHabit({ name: '', description: '', color: '#8b5cf6' })
    setShowNewHabitForm(false)
  }

  const openNewHabitForm = () => {
    setShowNewHabitForm(true)
  }

  return (
    <div className="relative">
      <HabitCalendar 
        habits={habits}
        onToggleHabit={handleToggleHabit}
        onAddHabit={openNewHabitForm}
      />

      {/* New Habit Modal */}
      {showNewHabitForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Novo Hábito</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do hábito
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="ex: Beber 2L de água"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="Por que este hábito é importante?"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cor
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewHabit({ ...newHabit, color })}
                      className={`w-8 h-8 rounded-full transition-all duration-200 ${
                        newHabit.color === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-110' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewHabitForm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddHabit}
                disabled={!newHabit.name.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Hábito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}