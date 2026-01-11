import { useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Heart, MagnifyingGlass } from "phosphor-react";

export function PartnerConnect() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    if (!email || !user) return;
    setLoading(true);
    setError("");

    try {
      // 1. Procurar o usuário pelo email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Email não encontrado! Ela já criou a conta no app?");
        setLoading(false);
        return;
      }

      // 2. Pegar o ID dela
      const partnerDoc = querySnapshot.docs[0];
      const partnerId = partnerDoc.id;

      // Evitar conectar consigo mesmo
      if (partnerId === user.uid) {
        setError("Você não pode namorar consigo mesmo (no app) 😂");
        setLoading(false);
        return;
      }

      // 3. ATUALIZAÇÃO DUPLA (O Pulo do Gato)
      // Salva o ID dela no seu perfil
      await updateDoc(doc(db, "users", user.uid), {
        partnerId: partnerId
      });

      // Salva o SEU ID no perfil dela (opcional, mas bom pra garantir)
      await updateDoc(doc(db, "users", partnerId), {
        partnerId: user.uid
      });

      // Recarrega a página para atualizar o estado
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg border-2 border-pink-100 max-w-md mx-auto mt-10">
      <div className="bg-pink-100 p-4 rounded-full mb-4">
        <Heart size={48} weight="fill" className="text-pink-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Conectar Duo</h2>
      <p className="text-gray-500 text-center mb-6">
        Digite o email que seu amor usou para entrar no app.
      </p>

      <div className="w-full relative mb-4">
        <input 
          type="email" 
          placeholder="exemplo@gmail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none"
        />
        <MagnifyingGlass className="absolute left-3 top-3.5 text-gray-400" size={20} />
      </div>

      {error && <p className="text-red-500 text-sm mb-4 font-bold">{error}</p>}

      <button 
        onClick={handleConnect}
        disabled={loading}
        className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition disabled:opacity-50"
      >
        {loading ? "Buscando..." : "Conectar ❤️"}
      </button>
    </div>
  );
}