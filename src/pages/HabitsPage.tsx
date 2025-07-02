import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Target, Flame, CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { Habit } from '../types/habit'
import { calculateStreak, isCompletedToday } from '../utils/habitUtils'

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])

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

  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0]
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const completed = habit.completedDates.includes(today)
        
        if (completed) {
          return {
            ...habit,
            completedToday: false,
            completedDates: habit.completedDates.filter(date => date !== today),
            streak: Math.max(0, habit.streak - 1)
          }
        } else {
          const newCompletedDates = [...habit.completedDates, today].sort()
          const newStreak = calculateStreak(newCompletedDates)
          
          return {
            ...habit,
            completedToday: true,
            completedDates: newCompletedDates,
            streak: newStreak
          }
        }
      }
      return habit
    })
    
    saveHabits(updatedHabits)
  }

  const deleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId)
    saveHabits(updatedHabits)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
                <p className="text-sm text-gray-600">Manage and track your habits</p>
              </div>
            </div>
            
            <Link to="/habits/new" className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Habit</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-600 mb-6">Start building better habits by creating your first one!</p>
            <Link to="/habits/new" className="btn-primary">
              Create Your First Habit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => {
              const completed = isCompletedToday(habit)
              
              return (
                <div key={habit.id} className="card p-6 hover:scale-105 transition-transform duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{habit.name}</h3>
                      {habit.description && (
                        <p className="text-sm text-gray-600">{habit.description}</p>
                      )}
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 ml-3"
                      style={{ backgroundColor: habit.color }}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {habit.streak} day streak
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {habit.completedDates.length} total
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        completed
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      <span>{completed ? 'Completed' : 'Mark Done'}</span>
                    </button>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}