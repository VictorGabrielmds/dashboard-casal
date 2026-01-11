import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore"; // Importe o db e setDoc
import { db } from "../services/firebaseConfig"; // Importe seu db

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // NOVO: Salva o email no Firestore para ser encontrado depois
      if (currentUser) {
        await setDoc(doc(db, "users", currentUser.uid), {
          email: currentUser.email,
          photoURL: currentUser.photoURL, // Bom para mostrar a fotinha depois
          displayName: currentUser.displayName
        }, { merge: true }); // merge: true não apaga os alarmes que já existirem
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// A SOLUÇÃO ESTÁ AQUI EMBAIXO:
// Adicionamos este comentário para dizer ao linter: "Eu sei o que estou fazendo,
// esse arquivo de Contexto é uma exceção à regra de Fast Refresh".

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);