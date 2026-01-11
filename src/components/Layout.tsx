import { Outlet, Link, useLocation } from "react-router-dom";
import { House, Drop, SignOut } from "phosphor-react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? "bg-blue-100 text-blue-600" 
    : "text-gray-500 hover:bg-gray-100";

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pl-64">
      {/* Sidebar para PC / Menu Inferior para Telemóvel */}
      <nav className="fixed bottom-0 left-0 w-full md:w-64 md:h-screen bg-white border-t md:border-t-0 md:border-r border-gray-200 z-50 flex md:flex-col justify-around md:justify-start p-4 md:p-6 gap-2">
        
        <div className="hidden md:block mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Nossu dashboard</h1>
        </div>

        <Link to="/dashboard" className={`p-3 rounded-xl flex items-center gap-3 font-medium transition ${isActive('/dashboard')}`}>
          <House size={24} weight={isActive('/dashboard').includes('blue') ? 'fill' : 'regular'} />
          <span className="hidden md:inline">Visão Geral</span>
        </Link>

        <Link to="/dashboard/water" className={`p-3 rounded-xl flex items-center gap-3 font-medium transition ${isActive('/dashboard/water')}`}>
          <Drop size={24} weight={isActive('/dashboard/water').includes('blue') ? 'fill' : 'regular'} />
          <span className="hidden md:inline">Água & Alarmes</span>
        </Link>

        <button 
          onClick={() => signOut(auth)}
          className="md:mt-auto p-3 rounded-xl flex items-center gap-3 font-medium text-red-500 hover:bg-red-50 transition"
        >
          <SignOut size={24} />
          <span className="hidden md:inline">Sair</span>
        </button>
      </nav>

      {/* Área onde o conteúdo das páginas aparece */}
      <main className="p-4 md:p-8 max-w-4xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}