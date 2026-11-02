import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ScanLine, UserCircle, ShoppingBag, Sparkles } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-transparent pt-[max(1.75rem,env(safe-area-inset-top,1.75rem))]">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="flex-1 flex flex-col pb-28 md:pb-8">
        <Outlet />
      </main>

      {/* Floating Bottom Navigation Bar (Mobile) - Glassmorphism com 5 itens */}
      <nav className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] left-1/2 -translate-x-1/2 w-[95%] max-w-md glass-effect bg-white/5 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-1.5 grid grid-cols-5 items-center z-50 md:hidden">
        
        {/* 1. Botão Scan */}
        <Link to="/scan" className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${currentPath === '/scan' ? 'text-primary-400 bg-primary-500/10' : 'text-white/40 hover:text-white/70'}`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${currentPath === '/scan' ? 'bg-primary-500 text-white shadow-[0_0_12px_theme(colors.primary.500/60%)]' : 'bg-primary-500/20 text-primary-400 border border-primary-500/30'}`}>
            <ScanLine className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-medium font-inter mt-1">Escanear</span>
        </Link>

        {/* 2. Dra. IA (Personalizado ao lado do Scanner) */}
        <Link to="/dra" className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${currentPath === '/dra' ? 'text-rose-300 bg-rose-500/15' : 'text-white/40 hover:text-rose-300/80'}`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${currentPath === '/dra' ? 'bg-gradient-to-tr from-primary-600 to-rose-400 text-white shadow-[0_0_15px_theme(colors.primary.400/60%)]' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-medium font-inter mt-1 text-rose-300 font-semibold">Dra. IA</span>
        </Link>

        {/* 3. Início */}
        <Link to="/app" className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${currentPath === '/app' ? 'text-primary-400 bg-primary-500/10' : 'text-white/40 hover:text-white/70'}`}>
          <Home className={`w-4 h-4 mb-0.5 ${currentPath === '/app' ? 'fill-primary-500/20' : ''}`} />
          <span className="text-[9px] font-medium font-inter">Início</span>
        </Link>

        {/* 4. Loja */}
        <Link to="/store" className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${currentPath === '/store' ? 'text-primary-400 bg-primary-500/10' : 'text-white/40 hover:text-white/70'}`}>
          <ShoppingBag className={`w-4 h-4 mb-0.5 ${currentPath === '/store' ? 'fill-primary-500/20' : ''}`} />
          <span className="text-[9px] font-medium font-inter">Loja</span>
        </Link>

        {/* 5. Perfil */}
        <Link to="/profile" className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${currentPath === '/profile' ? 'text-primary-400 bg-primary-500/10' : 'text-white/40 hover:text-white/70'}`}>
          <UserCircle className={`w-4 h-4 mb-0.5 ${currentPath === '/profile' ? 'fill-primary-500/20' : ''}`} />
          <span className="text-[9px] font-medium font-inter">Perfil</span>
        </Link>

      </nav>
    </div>
  );
}
