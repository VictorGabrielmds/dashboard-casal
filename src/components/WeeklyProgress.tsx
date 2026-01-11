// src/components/WeeklyProgress.tsx
import { useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface WeeklyProps {
  userId: string;
}
interface DailyProgress {
  day: string;   // Ex: "S", "T", "Q"
  date: string;  // Ex: "2026-01-10"
  value: number; // Ex: 1500
  goal: number;  // Ex: 3000
}

export function WeeklyProgress({ userId }: WeeklyProps) {
  const [weeklyData, setWeeklyData] = useState<DailyProgress[]>([]);

  useEffect(() => {
    const fetchWeek = async () => {
      const days = [];
      const today = new Date();
      
      // Loop para pegar os últimos 7 dias (incluindo hoje)
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('pt-BR', { weekday: 'narrow' }); // D, S, T, Q...
        
        // Gera o ID provável: UID_DATA
        const docId = `${userId}_${dateStr}`;
        
        // Busca individual (num app grande, usaríamos uma query "where date > x")
        const docSnap = await getDoc(doc(db, "daily_logs", docId));
        
        days.push({
          day: dayName,
          date: dateStr,
          value: docSnap.exists() ? docSnap.data().waterCurrent : 0,
          goal: docSnap.exists() ? docSnap.data().waterGoal : 3000
        });
      }
      setWeeklyData(days);
    };

    if(userId) fetchWeek();
  }, [userId]);

  return (
    <div className="mt-6">
      <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Últimos 7 dias</h4>
      <div className="flex justify-between items-end h-24 gap-2">
        {weeklyData.map((data, index) => {
           const percent = Math.min((data.value / data.goal) * 100, 100);
           return (
             <div key={index} className="flex flex-col items-center flex-1 gap-1">
               <div className="w-full bg-gray-100 rounded-t-md relative h-full flex items-end overflow-hidden">
                 <div 
                   className="w-full bg-blue-400 opacity-80 rounded-t-md transition-all"
                   style={{ height: `${percent}%` }}
                 ></div>
               </div>
               <span className="text-xs font-bold text-gray-400">{data.day}</span>
             </div>
           )
        })}
      </div>
    </div>
  );
}