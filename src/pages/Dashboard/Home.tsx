import { useAuth } from "../../contexts/AuthContext";
import { WeeklyProgress } from "../../components/WeeklyProgress";

export function DashboardHome() {
  const { user } = useAuth();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bom dia, amor! ☀️</h1>
        <p className="text-gray-500">Vê como estamos a ir esta semana.</p>
      </header>

      {/* Gráfico Semanal */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="font-bold text-lg mb-4">O Nosso Histórico</h2>
        {user && <WeeklyProgress userId={user.uid} />}
      </div>
    </div>
  );
}