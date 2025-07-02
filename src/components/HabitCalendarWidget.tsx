import { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Habit } from '../types/habit'

interface HabitCalendarWidgetProps {
  habits: Habit[]
  onToggleHabit: (habitId: string, date: string) => void
  onAddHabit: () => void
}

export default function HabitCalendarWidget({ habits, onToggleHabit, onAddHabit }: HabitCalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }, [])

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const selectedDateHabits = getSelectedDateHabits()
  const completedHabitsToday = selectedDateHabits.filter(h => h.completedOnSelectedDate).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Section */}
      <div className="lg:col-span-2">
        <div className="card p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Calendário de Hábitos</h2>
              <p className="text-gray-600">Acompanhe seu progresso diário</p>
            </div>
            
            <button
              onClick={onAddHabit}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Hábito</span>
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h3 className="text-xl font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-gray-500 font-medium text-sm py-3">
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
                  className={`aspect-square rounded-lg transition-all duration-200 relative border-2 ${
                    isSelected 
                      ? 'bg-primary-500 text-white border-primary-500 shadow-lg scale-105' 
                      : isToday
                      ? 'border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100'
                      : completionPercentage > 0
                      ? 'bg-primary-100 border-primary-200 text-primary-700 hover:bg-primary-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{day.getDate()}</span>
                  {completionPercentage > 0 && !isSelected && (
                    <div className="absolute bottom-1 left-1 right-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Selected Date Info */}
        <div className="card p-6">
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Data Selecionada</div>
            <div className="text-2xl font-bold text-gray-900">
              {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) : ''}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso do dia</span>
              <span>{completedHabitsToday}/{habits.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: habits.length > 0 ? `${(completedHabitsToday / habits.length) * 100}%` : '0%' 
                }}
              />
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
              {habits.length > 0 ? Math.round((completedHabitsToday / habits.length) * 100) : 0}%
            </div>
          </div>

          {/* Habits List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">Hábitos do Dia</h4>
            {selectedDateHabits.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p className="mb-2">Nenhum hábito criado ainda</p>
                <button
                  onClick={onAddHabit}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Criar primeiro hábito
                </button>
              </div>
            ) : (
              selectedDateHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => onToggleHabit(habit.id, selectedDate)}
                    className="flex-shrink-0"
                  >
                    {habit.completedOnSelectedDate ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 hover:text-primary-500" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className={`font-medium ${
                        habit.completedOnSelectedDate ? 'text-green-600 line-through' : 'text-gray-900'
                      }`}>
                        {habit.name}
                      </span>
                    </div>
                    {habit.description && (
                      <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Statistics */}
        {habits.length > 0 && (
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Estatísticas</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de hábitos</span>
                <span className="font-semibold text-gray-900">{habits.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maior sequência</span>
                <span className="font-semibold text-gray-900">
                  {Math.max(...habits.map(h => h.streak), 0)} dias
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hábitos concluídos hoje</span>
                <span className="font-semibold text-primary-600">
                  {habits.filter(h => h.completedDates.includes(new Date().toISOString().split('T')[0])).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}