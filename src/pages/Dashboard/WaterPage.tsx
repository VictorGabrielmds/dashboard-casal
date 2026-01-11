import { useAuth } from "../../contexts/AuthContext";
import { WaterTracker } from "../../components/WaterTracker";
import { NotificationManager } from "../../components/NotificationManager";
// 1. Importe os novos componentes
import { usePartner } from "../../hooks/usePartner";
import { PartnerConnect } from "../../components/PartnerConnect";
import { NudgeButton } from "../../components/NudgeButton";

export function WaterPage() {
  const { user } = useAuth();
  const { partnerId, loading } = usePartner(); // 2. Use o hook

  const today = new Date().toISOString().split('T')[0];
  const myLogId = user ? `${user.uid}_${today}` : "";
  
  // 3. ID dinâmico!
  const partnerLogId = partnerId ? `${partnerId}_${today}` : "";

  if (loading) return <div>Carregando...</div>;

  // 4. Se não tiver parceiro, mostra a tela de conectar
  if (!partnerId) {
    return <PartnerConnect />;
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">Hidratação 💧</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          {user && <WaterTracker logId={myLogId} isMe={true} />}
          <NotificationManager />
        </div>

        <div>
           {/* Agora passamos o ID real do parceiro! */}
           <WaterTracker logId={partnerLogId} isMe={false} />
           <div className="mt-4">
             <NudgeButton partnerId={partnerId} />
           </div>
        </div>
      </div>
    </div>
  );
}