import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ScanLine, UserCircle, History } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-transparent">
      {/* Luxury Header */}
      <header className="px-6 py-4 md:px-8 border-b border-tadra-goldLight/20 bg-white/70 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <h1 className="text-2xl font-playfair font-semibold text-tadra-wine tracking-tight">
          <Link to="/app">TADRA</Link>
        </h1>
        <div className="w-8 h-8 rounded-full bg-tadra-bgDeep border border-tadra-goldLight/30 flex items-center justify-center shadow-inner">
          <UserCircle className="w-5 h-5 text-tadra-wine/70" />
        </div>
      </header>
      
      <main className="flex-1 flex flex-col pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Floating Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-tadra-wine/10 p-2 flex justify-between items-center z-50 md:hidden">
        
        <Link to="/app" className={`flex-1 flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${currentPath === '/app' ? 'text-tadra-wine bg-tadra-wine/5' : 'text-gray-400 hover:text-tadra-wine/70'}`}>
          <Home className={`w-6 h-6 mb-1 ${currentPath === '/app' ? 'fill-tadra-wine/10' : ''}`} />
          <span className="text-[10px] font-medium font-geist">Início</span>
        </Link>
        
        <Link to="/scan" className="relative -top-5">
          <div className="w-16 h-16 rounded-full bg-tadra-wine flex items-center justify-center shadow-xl shadow-tadra-wine/30 border-4 border-[#fffaf2] text-white hover:scale-105 transition-transform active:scale-95">
            <ScanLine className="w-7 h-7" />
          </div>
        </Link>

        <Link to="/onboarding" className={`flex-1 flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${currentPath === '/onboarding' ? 'text-tadra-wine bg-tadra-wine/5' : 'text-gray-400 hover:text-tadra-wine/70'}`}>
          <History className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium font-geist">Perfil</span>
        </Link>

      </nav>
    </div>
  );
}
