import { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig'; // Verifique se o caminho está certo
import { doc, onSnapshot, updateDoc, increment, setDoc } from 'firebase/firestore';
import { Drop, Plus } from 'phosphor-react';

// --- CALIBRAÇÃO DA GARRAFA ---
const BOTTLE_CONFIG = {
  START_AT: 5,   // Altura onde a água começa (fundo da garrafa)
  STOP_AT: 88,    // Altura onde a água para (perto da tampa)
  
  // NOVO: Ajuste lateral para a água não vazar
  // Aumente esse número se a água estiver saindo pelos lados!
  PADDING_X: 12,  
};
// ------------------------------

interface WaterTrackerProps {
  logId: string;
  isMe: boolean;
}

export function WaterTracker({ logId, isMe }: WaterTrackerProps) {
  const [data, setData] = useState({ current: 0, goal: 3000 });
  const [amountToAdd, setAmountToAdd] = useState(250);

  useEffect(() => {
    if (!logId) return;
    const unsub = onSnapshot(doc(db, "daily_logs", logId), (docSnap) => {
      if (docSnap.exists()) {
        const log = docSnap.data();
        setData({ current: log.waterCurrent, goal: log.waterGoal });
      } else if (isMe) {
        setDoc(doc(db, "daily_logs", logId), {
          waterCurrent: 0,
          waterGoal: 3000,
          date: new Date().toISOString().split('T')[0]
        });
      }
    });
    return () => unsub();
  }, [logId, isMe]);

  const addWater = async () => {
    if (!isMe || amountToAdd <= 0) return;
    const docRef = doc(db, "daily_logs", logId);
    await updateDoc(docRef, { waterCurrent: increment(amountToAdd) });
  };

  const realPercentage = Math.min((data.current / data.goal) * 100, 100);
  
  // Cálculo da altura visual
  const range = BOTTLE_CONFIG.STOP_AT - BOTTLE_CONFIG.START_AT;
  const visualHeight = BOTTLE_CONFIG.START_AT + (range * (realPercentage / 100));

  const themeColor = isMe ? 'blue' : 'pink';
  const liquidColor = isMe ? '#3b82f6' : '#f472b6'; 

  return (
    <div className={`p-6 rounded-2xl shadow-lg border-2 ${isMe ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200'}`}>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className={`font-bold text-xl flex items-center gap-2 text-${themeColor}-700`}>
          <Drop size={28} weight="fill" className={`text-${themeColor}-500`} />
          {isMe ? "Eu" : "Ela"}
        </h3>
        <span className={`block text-2xl font-bold text-${themeColor}-800`}>{data.current}ml</span>
      </div>

      <div className="flex flex-col items-center py-4">
        {/* Container Principal da Garrafa */}
        <div className="relative w-[220px] h-[340px]">
          
          {/* CAMADA 1: ÁGUA + MÁSCARA */}
          <div 
            className="absolute inset-0 z-0 overflow-hidden"
            style={{
              // Espreme a água lateralmente para não vazar
              left: `${BOTTLE_CONFIG.PADDING_X}px`,
              right: `${BOTTLE_CONFIG.PADDING_X}px`,
              
              // Máscara (shape.png)
              maskImage: `url('/shape.png')`,
              WebkitMaskImage: `url('/shape.png')`,
              maskSize: '100% 100%', // Força a máscara a cobrir tudo
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
          >
            {/* O Líquido que sobe */}
            <div 
              className="absolute bottom-0 left-0 w-full transition-all duration-700 ease-in-out flex flex-col justify-end"
              style={{ height: `${visualHeight}%` }}
            >
              {/* ONDA SUAVE (SVG Atualizado) */}
              {realPercentage > 0 && (
                <div className="w-[200%] h-10 relative -mb-[1px] flex-shrink-0">
                  <svg 
                    viewBox="0 0 1000 100" 
                    preserveAspectRatio="none"
                    className="absolute top-0 left-0 w-full h-full wave-anim"
                    fill={liquidColor}
                    style={{ animationDuration: '4s' }} // Velocidade da onda
                  >
                    {/* Desenho de onda mais suave */}
                    <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 V100 H0 Z" opacity="0.8"/>
                    <path d="M0,60 C200,10 400,90 600,50 C800,10 900,80 1000,60 V100 H0 Z" opacity="0.6"/>
                  </svg>
                </div>
              )}

              {/* Bloco Sólido */}
              <div 
                className="w-full flex-1"
                style={{ backgroundColor: liquidColor }}
              ></div>
            </div>
          </div>

          {/* CAMADA 2: OVERLAY (A Garrafa Bonita) */}
          <img 
            src="/overlay.png" 
            alt="Garrafa Visual" 
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" 
          />
          
          {/* Porcentagem no meio */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
             <span 
               className="percent text-4xl font-black text-white drop-shadow-md stroke-black"
               style={{ 
                 textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                 // Se a água estiver muito baixa, muda a cor do texto para cinza para ler melhor
                 color: realPercentage > 58 ? 'white' : '#4b5563' 
               }}
             >
              {Math.round(realPercentage)}%
            </span>
          </div>

        </div>
      </div>

      {isMe && (
        <div className="flex gap-2 mt-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <input 
            type="number"
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(Number(e.target.value))}
            className="w-full pl-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg outline-none"
          />
          <button 
            onClick={addWater}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition active:scale-95"
          >
            <Plus weight="bold" size={24} />
          </button>
        </div>
      )}
    </div>
  );
}