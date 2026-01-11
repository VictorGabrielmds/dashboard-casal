// Exemplo dentro do seu componente Dashboard
import { useAuth } from "../../contexts/AuthContext"; // Ajuste o caminho
import { WaterTracker } from "../../components/WaterTracker"; // Ajuste o caminho
import { NotificationManager } from "../../components/NotificationManager";

export function Dashboard() {
  const { user } = useAuth();
  
  // 1. Pega a data de hoje formatada (AAAA-MM-DD)
  // Isso garante que amanhã o app zere sozinho!
  const today = new Date().toISOString().split('T')[0];

  // 2. Gera o ID do seu log
  // Ex: "H8ds78sd6_2026-01-10"
  const myLogId = user ? `${user.uid}_${today}` : "";

  // 3. O ID Dela (HARDCODED POR ENQUANTO)
  // Como ainda não criamos o sistema de "convite", você vai precisar
  // pegar o UID dela manualmente no console do Firebase Authentication
  // e colar aqui para testar.
  const PARTNER_UID = "COLE_O_UID_DELA_AQUI_PARA_TESTAR"; 
  const partnerLogId = `${PARTNER_UID}_${today}`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Olá, Casal! 👋</h1>
        <p className="text-gray-500">Meta de hoje: {today}</p>
      </header>
      <NotificationManager />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SEU TRACKER */}
        {user && (
          <WaterTracker 
            logId={myLogId} 
            isMe={true} 
          />
        )}

        {/* TRACKER DELA */}
        {PARTNER_UID && (
          <WaterTracker 
            logId={partnerLogId} 
            isMe={false} 
          />
        )}
      </div>
    </div>
  );
}