import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Target, TrendingUp, CheckCircle2, LogOut } from "lucide-react";
import type { Habit } from "../types/habit";
import { isCompletedToday } from "../utils/habitUtils";
import GitHubStyleCalendar from "../components/GitHubStyleCalendar";

interface User {
  name?: string;
  email: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth/login");
      return;
    }

    setUser(JSON.parse(userData));

    // Load habits
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter((habit) =>
    isCompletedToday(habit)
  ).length;
  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo de volta, {user.name || user.email}!
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/habits" className="btn-secondary">
                Gerenciar Hábitos
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
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

        {/* GitHub Style Calendar */}
        <GitHubStyleCalendar habits={habits} />

        {/* Quick Actions */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/habits/new" className="btn-primary text-center">
              Criar Novo Hábito
            </Link>
            <Link to="/habits" className="btn-secondary text-center">
              Ver Todos os Hábitos
            </Link>
            <Link to="/" className="btn-secondary text-center">
              Acompanhar Hábitos de Hoje
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Atividade Recente
          </h2>
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Nenhum hábito criado ainda. Comece a construir melhores hábitos
                hoje!
              </p>
              <Link to="/habits/new" className="btn-primary mt-4 inline-block">
                Criar Seu Primeiro Hábito
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {habits.slice(0, 5).map((habit) => {
                const completed = isCompletedToday(habit);

                return (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {habit.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {habit.streak} dias de sequência
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {completed ? (
                        <span className="text-green-600 text-sm font-medium">
                          Concluído
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Pendente</span>
                      )}
                      <CheckCircle2
                        className={`w-5 h-5 ${
                          completed ? "text-green-600" : "text-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
