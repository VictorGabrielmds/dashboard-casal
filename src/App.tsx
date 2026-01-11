// src/App.tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/Login/Index";

// Layout e Páginas Novas
import { Layout } from "./components/Layout";
import { DashboardHome } from "./pages/Dashboard/Home";
import { WaterPage } from "./pages/Dashboard/WaterPage";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Todas as rotas dentro de /dashboard usam o Layout (Menu) */}
          <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
            
            {/* Rota Padrão (/dashboard) -> Vai para o Home */}
            <Route index element={<DashboardHome />} />
            
            {/* Rota Água (/dashboard/water) */}
            <Route path="water" element={<WaterPage />} />
            
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;