import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { HandWaving } from "phosphor-react";

interface NudgeButtonProps {
  partnerId: string | null;
}

export function NudgeButton({ partnerId }: NudgeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendNudge = async () => {
    if (!partnerId) return;
    setLoading(true);

    try {
      // Atualiza o perfil dela com o horário de AGORA
      await updateDoc(doc(db, "users", partnerId), {
        lastNudge: Date.now()
      });
      
      setSent(true);
      setTimeout(() => setSent(false), 3000); // Reseta msg depois de 3s
    } catch (error) {
      console.error("Erro ao enviar cutucão", error);
    } finally {
      setLoading(false);
    }
  };

  if (!partnerId) return null;

  return (
    <button
      onClick={sendNudge}
      disabled={loading}
      className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-4 rounded-xl shadow-sm transition transform active:scale-95 flex items-center justify-center gap-2"
    >
      {sent ? (
        <span>Enviado! 🚀</span>
      ) : (
        <>
          <HandWaving size={24} weight="fill" />
          Lembrar ela de beber água!
        </>
      )}
    </button>
  );
}