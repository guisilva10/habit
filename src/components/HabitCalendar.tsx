import { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Habit } from '../types/habit'


interface HabitCalendarProps {
  habits: Habit[]
  onToggleHabit: (habitId: string, date: string) => void
  onAddHabit: () => void
}

export default function HabitCalendar({ habits, onToggleHabit, onAddHabit }: HabitCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }, [])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getHabitCompletionForDate = (habit: Habit, date: string) => {
    return habit.completedDates.includes(date)
  }

  const getSelectedDateHabits = () => {
    if (!selectedDate) return []
    
    return habits.map(habit => ({
      ...habit,
      completedOnSelectedDate: getHabitCompletionForDate(habit, selectedDate)
    }))
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const selectedDateHabits = getSelectedDateHabits()
  const completedHabitsToday = selectedDateHabits.filter(h => h.completedOnSelectedDate).length

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Main Calendar Area */}
        <div className="flex-1 p-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-white">habits</h1>
              </div>
              
              <button
                onClick={onAddHabit}
                className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg transition-colors border border-purple-500"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Novo hábito</span>
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-white">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {/* Week day headers */}
              {weekDays.map((day, index) => (
                <div key={index} className="text-center text-purple-200 font-medium text-sm py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="aspect-square"></div>
                }
                
                const dateStr = formatDate(day)
                const isSelected = dateStr === selectedDate
                const isToday = dateStr === new Date().toISOString().split('T')[0]
                
                // Calculate completion percentage for this day
                const totalHabits = habits.length
                const completedHabits = habits.filter(habit => 
                  getHabitCompletionForDate(habit, dateStr)
                ).length
                
                const completionPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square rounded-lg transition-all duration-200 relative ${
                      isSelected 
                        ? 'bg-white text-purple-800 shadow-lg scale-105' 
                        : completionPercentage > 0
                        ? 'bg-purple-500 hover:bg-purple-400'
                        : 'bg-purple-800 hover:bg-purple-700'
                    } ${isToday ? 'ring-2 ring-purple-300' : ''}`}
                  >
                    <span className="text-sm font-medium">{day.getDate()}</span>
                    {completionPercentage > 0 && !isSelected && (
                      <div 
                        className="absolute bottom-1 left-1 right-1 h-1 bg-purple-300 rounded-full"
                        style={{ 
                          background: `linear-gradient(to right, #a855f7 ${completionPercentage}%, transparent ${completionPercentage}%)` 
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 p-6 border-l border-gray-700">
          <div className="mb-6">
            <div className="text-gray-400 text-sm mb-1">Hoje</div>
            <div className="text-2xl font-bold">
              {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit'
              }) : ''}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progresso do dia</span>
              <span>{completedHabitsToday}/{habits.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: habits.length > 0 ? `${(completedHabitsToday / habits.length) * 100}%` : '0%' 
                }}
              />
            </div>
          </div>

          {/* Habits List */}
          <div className="space-y-3">
            {selectedDateHabits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum hábito criado ainda</p>
                <button
                  onClick={onAddHabit}
                  className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                >
                  Criar primeiro hábito
                </button>
              </div>
            ) : (
              selectedDateHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <button
                    onClick={() => onToggleHabit(habit.id, selectedDate)}
                    className="flex-shrink-0"
                  >
                    {habit.completedOnSelectedDate ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 hover:text-white" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className={`font-medium ${
                        habit.completedOnSelectedDate ? 'text-green-400' : 'text-white'
                      }`}>
                        {habit.name}
                      </span>
                    </div>
                    {habit.description && (
                      <p className="text-sm text-gray-400 mt-1">{habit.description}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Additional Info */}
          {habits.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total de hábitos</span>
                  <span className="text-white font-medium">{habits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Maior sequência</span>
                  <span className="text-white font-medium">
                    {Math.max(...habits.map(h => h.streak), 0)} dias
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}