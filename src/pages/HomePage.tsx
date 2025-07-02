import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, TrendingUp, CheckCircle2, Calendar } from "lucide-react";
import { Habit } from "../types/habit";
import { calculateStreak, isCompletedToday } from "../utils/habitUtils";
import HabitCalendarWidget from "../components/HabitCalendarWidget";

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showNewHabitForm, setShowNewHabitForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    color: "#0ea5e9",
  });

  const colors = [
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
  ];

  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  const saveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      color: newHabit.color,
      streak: 0,
      completedToday: false,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    saveHabits([...habits, habit]);
    setNewHabit({ name: "", description: "", color: "#0ea5e9" });
    setShowNewHabitForm(false);
  };

  const toggleHabit = (habitId: string, date?: string) => {
    const targetDate = date || new Date().toISOString().split("T")[0];
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(targetDate);

        if (isCompleted) {
          return {
            ...habit,
            completedToday: false,
            completedDates: habit.completedDates.filter(
              (d) => d !== targetDate
            ),
            streak: Math.max(0, habit.streak - 1),
          };
        } else {
          const newCompletedDates = [
            ...habit.completedDates,
            targetDate,
          ].sort();
          const newStreak = calculateStreak(newCompletedDates);

          return {
            ...habit,
            completedToday: true,
            completedDates: newCompletedDates,
            streak: newStreak,
          };
        }
      }
      return habit;
    });

    saveHabits(updatedHabits);
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter((habit) =>
    isCompletedToday(habit)
  ).length;
  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Habit Tracker
                </h1>
                <p className="text-sm text-gray-600">
                  Construa melhores hábitos, um dia de cada vez
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/calendar"
                className="btn-secondary flex items-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Calendário</span>
              </Link>
              <Link to="/auth/login" className="btn-secondary">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Hábitos
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalHabits}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Concluídos Hoje
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedToday}/{totalHabits}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Taxa de Conclusão
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {completionRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Widget */}
        <HabitCalendarWidget
          habits={habits}
          onToggleHabit={toggleHabit}
          onAddHabit={() => setShowNewHabitForm(true)}
        />
      </main>

      {/* New Habit Modal */}
      {showNewHabitForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Criar Novo Hábito
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Hábito
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  placeholder="ex: Beber 8 copos de água"
                  className="input-field"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, description: e.target.value })
                  }
                  placeholder="Por que este hábito é importante para você?"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewHabit({ ...newHabit, color })}
                      className={`w-8 h-8 rounded-full transition-all duration-200 ${
                        newHabit.color === color
                          ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                          : "hover:scale-110"
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
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={addHabit}
                disabled={!newHabit.name.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Hábito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
