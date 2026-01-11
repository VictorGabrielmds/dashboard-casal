// src/pages/Login/index.tsx
import { useState } from "react";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { auth, googleProvider } from "../../services/firebaseConfig";
import { GoogleLogo } from "phosphor-react"; 
import { useNavigate } from "react-router-dom";

// 1. Definimos o tipo do erro que o Firebase retorna
interface FirebaseError {
  code: string;
  message: string;
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError("Erro ao logar com Google.");
      console.error(err);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      // 2. Fazemos o "Cast" do erro para o tipo que criamos
      const firebaseError = err as FirebaseError;
      
      // Agora o TypeScript sabe que existe a propriedade .code
      if (firebaseError.code === 'auth/wrong-password') {
        setError("Senha incorreta.");
      } else if (firebaseError.code === 'auth/user-not-found') {
        setError("Usuário não encontrado.");
      } else if (firebaseError.code === 'auth/email-already-in-use') {
        setError("Email já cadastrado.");
      } else if (firebaseError.code === 'auth/weak-password') {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Ocorreu um erro. Tente novamente.");
        console.error(err); // Útil para debugar erros desconhecidos
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          {isRegistering ? "Criar Conta" : "Bem-vindo de volta!"}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Dashboard do Casal 💑
        </p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium">{error}</div>}

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition active:scale-95"
          >
            {isRegistering ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Ou entre com</span></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition active:scale-95 text-gray-700 font-medium"
        >
          <GoogleLogo size={20} weight="bold" className="text-red-500" />
          Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isRegistering ? "Já tem uma conta?" : "Ainda não tem conta?"}{" "}
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(""); // Limpa o erro ao trocar de modo
            }}
            className="text-blue-600 font-bold hover:underline"
          >
            {isRegistering ? "Faça Login" : "Cadastre-se"}
          </button>
        </p>
      </div>
    </div>
  );
}