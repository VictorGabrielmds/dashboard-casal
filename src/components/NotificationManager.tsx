import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { Alarm, Trash } from 'phosphor-react';

export function NotificationManager() {
  const { user } = useAuth();
  const [alarms, setAlarms] = useState<string[]>([]);
  const [newTime, setNewTime] = useState("");
  
  // Ref para guardar o último horário que recebemos um cutucão para não repetir
  const lastNudgeTimeRef = useRef<number>(0);

  // 1. Permissão de notificação
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 2. Escutar Perfil (Alarmes + Cutucões)
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();

      // Carrega alarmes
      if (data.alarms) setAlarms(data.alarms);

      // --- LÓGICA DO CUTUCÃO (NOVO) ---
      if (data.lastNudge) {
        // Se o horário do cutucão for mais novo que o último que vimos
        // E se foi feito nos últimos 5 minutos (pra não apitar coisa velha)
        const now = Date.now();
        const isRecent = (now - data.lastNudge) < 5 * 60 * 1000; 

        if (data.lastNudge > lastNudgeTimeRef.current && isRecent) {
          // Dispara a notificação
          new Notification("Ei! Amor tá te chamando! ❤️", {
            body: "Hora de beber água! Se hidrata!",
            icon: "/icon-water.png" // Opcional
          });
          
          // Toca um somzinho (Opcional)
          const audio = new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg');
          audio.play().catch(() => {}); // Ignora erro se não der play

          // Atualiza a referência pra não tocar de novo o mesmo
          lastNudgeTimeRef.current = data.lastNudge;
        }
      }
    });

    return () => unsub();
  }, [user]);

  // 3. Relógio dos Alarmes (Mantive igual)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      if (alarms.includes(currentTime)) {
        new Notification("Alarme de Água! 💧", { body: "Mantenha o foco!" });
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [alarms]);

  const addAlarm = async () => {
    if (!newTime || !user) return;
    await setDoc(doc(db, "users", user.uid), { alarms: arrayUnion(newTime) }, { merge: true });
    setNewTime("");
  };

  const removeAlarm = async (time: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), { alarms: arrayRemove(time) });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-6">
      <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-700 text-lg">
        <Alarm size={24} className="text-purple-600" /> 
        Seus Alarmes
      </h3>

      <div className="flex gap-2 mb-4">
        <input 
          type="time" 
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg flex-1 focus:border-purple-500 outline-none"
        />
        <button onClick={addAlarm} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition">
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {alarms.map(time => (
          <div key={time} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-bold flex items-center gap-2 border border-purple-100">
            {time}
            <button onClick={() => removeAlarm(time)} className="hover:text-red-500 transition"><Trash size={14} /></button>
          </div>
        ))}
        {alarms.length === 0 && <span className="text-gray-400 text-sm">Sem alarmes.</span>}
      </div>
    </div>
  );
}