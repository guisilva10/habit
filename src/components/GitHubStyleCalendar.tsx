import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import type { Habit } from '../types/habit'
import { calculateStreak } from '../utils/habitUtils'

interface GitHubStyleCalendarProps {
  habits: Habit[]
}

export default function GitHubStyleCalendar({ habits: initialHabits }: GitHubStyleCalendarProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Update habits when props change
  React.useEffect(() => {
    setHabits(initialHabits)
  }, [initialHabits])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSelectedDate(null)
      }
    }

    if (selectedDate) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedDate])

  const saveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits)
    localStorage.setItem('habits', JSON.stringify(updatedHabits))
  }

  const toggleHabitForDate = (habitId: string, date: string) => {
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

  // Generate all days of the year
  const generateYearDays = (year: number) => {
    const days = []
    const startDate = new Date(year, 0, 1)
    
    // Start from the first Sunday of the year or before
    const firstSunday = new Date(startDate)
    firstSunday.setDate(startDate.getDate() - startDate.getDay())
    
    const currentDate = new Date(firstSunday)
    
    // Generate enough days to fill the grid (53 weeks * 7 days)
    for (let i = 0; i < 371; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const getCompletionLevel = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const totalHabits = habits.length
    
    if (totalHabits === 0) return 0
    
    const completedHabits = habits.filter(habit => 
      habit.completedDates.includes(dateStr)
    ).length
    
    const percentage = (completedHabits / totalHabits) * 100
    
    if (percentage === 0) return 0
    if (percentage <= 25) return 1
    if (percentage <= 50) return 2
    if (percentage <= 75) return 3
    return 4
  }

  const getCompletionColor = (level: number) => {
    const colors = [
      'bg-gray-100', // 0% - empty
      'bg-blue-200', // 1-25%
      'bg-blue-300', // 26-50%
      'bg-blue-500', // 51-75%
      'bg-blue-600'  // 76-100%
    ]
    return colors[level]
  }

  const getHabitsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return habits.map(habit => ({
      ...habit,
      completed: habit.completedDates.includes(dateStr)
    }))
  }

  const handleDayClick = (day: Date, event: React.MouseEvent) => {
    const dateStr = day.toISOString().split('T')[0]
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    
    // Calculate dropdown position
    const x = rect.left + rect.width / 2
    const y = rect.bottom + 8
    
    setDropdownPosition({ x, y })
    setSelectedDate(dateStr)
  }

  const days = generateYearDays(currentYear)
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ]
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

  const selectedDateHabits = selectedDate ? getHabitsForDate(new Date(selectedDate)) : []

  return (
    <>
      <div className="card p-6 mb-8 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Calendário de Hábitos</h2>
            <p className="text-sm text-gray-600">Clique em um dia para ver e gerenciar seus hábitos</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentYear(prev => prev - 1)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <span className="font-semibold text-gray-900 min-w-[4rem] text-center">
                {currentYear}
              </span>
              <button
                onClick={() => setCurrentYear(prev => prev + 1)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Month labels */}
            <div className="flex mb-2">
              <div className="w-8"></div> {/* Space for weekday labels */}
              {months.map((month) => (
                <div key={month} className="flex-1 text-xs text-gray-600 text-center">
                  {month}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="flex">
              {/* Weekday labels */}
              <div className="flex flex-col mr-2">
                {weekDays.map((day, index) => (
                  <div key={day} className="h-3 flex items-center text-xs text-gray-600 mb-1">
                    {index % 2 === 1 ? day : ''}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {days.map((day, index) => {
                  const dateStr = day.toISOString().split('T')[0]
                  const level = getCompletionLevel(day)
                  const isCurrentYear = day.getFullYear() === currentYear
                  const isToday = dateStr === new Date().toISOString().split('T')[0]
                  const isSelected = selectedDate === dateStr

                  return (
                    <button
                      key={index}
                      onClick={(e) => handleDayClick(day, e)}
                      className={`w-3 h-3 rounded-sm transition-all duration-200 ${
                        isCurrentYear ? getCompletionColor(level) : 'bg-gray-50'
                      } ${
                        isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                      } ${
                        isSelected ? 'ring-2 ring-primary-500 ring-offset-1 scale-110' : ''
                      } hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 hover:scale-105`}
                      title={`${day.toLocaleDateString('pt-BR')} - ${
                        habits.length > 0 
                          ? `${habits.filter(h => h.completedDates.includes(dateStr)).length}/${habits.length} hábitos`
                          : 'Nenhum hábito'
                      }`}
                    />
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Menos</span>
                <div className="flex space-x-1">
                  {[0, 1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-sm ${getCompletionColor(level)}`}
                    />
                  ))}
                </div>
                <span>Mais</span>
              </div>
              
              <div className="text-xs text-gray-500">
                {habits.length} {habits.length === 1 ? 'hábito' : 'hábitos'} no total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {selectedDate && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[280px] max-w-[320px]"
          style={{
            left: `${dropdownPosition.x}px`,
            top: `${dropdownPosition.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Header com seta */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
          </div>

          {/* Conteúdo do dropdown */}
          <div className="p-4">
            {/* Data */}
            <div className="mb-4 pb-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
            </div>

            {/* Lista de hábitos */}
            <div className="space-y-2">
              {selectedDateHabits.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">Nenhum hábito encontrado</p>
                </div>
              ) : (
                selectedDateHabits.map(habit => (
                  <div 
                    key={habit.id} 
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                    onClick={() => toggleHabitForDate(habit.id, selectedDate)}
                  >
                    <button className="flex-shrink-0">
                      {habit.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    
                    <span className={`flex-1 text-sm font-medium ${
                      habit.completed 
                        ? 'text-green-600 line-through' 
                        : 'text-gray-900'
                    }`}>
                      {habit.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}