import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ScanLine, UserCircle, ShoppingBag, Search } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-transparent">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Removed Header as per user request */}
      
      <main className="flex-1 flex flex-col pb-28 md:pb-8">
        <Outlet />
      </main>

      {/* Floating Bottom Navigation Bar (Mobile) - Glassmorphism */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-sm glass-effect bg-white/5 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-2 grid grid-cols-4 items-center z-50 md:hidden">
        
        <Link to="/app" className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${currentPath === '/app' ? 'text-primary-400 bg-primary-500/10' : 'text-white/40 hover:text-white/70'}`}>
          <Home className={`w-5 h-5 mb-1 ${currentPath === '/app' ? 'fill-primary-500/20' : ''}`} />
          <span className="text-[10px] font-medium font-inter">Início</span>
        </Link>

        {/* Center Scan Button with Glow */}
        <Link to="/scan" className="relative -top-6 flex flex-col items-center justify-center mx-auto">
          <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center glow border border-primary-400/50 text-white hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_theme('colors.primary.500'/60%)]">
            <ScanLine className="w-6 h-6" />
          </div>
        </Link>

        <Link to="/store" className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${currentPath === '/store' ? 'text-primary-400 bg-primary-500/10' : 'text-white/40 hover:text-white/70'}`}>
          <ShoppingBag className={`w-5 h-5 mb-1 ${currentPath === '/store' ? 'fill-primary-500/20' : ''}`} />
          <span className="text-[10px] font-medium font-inter">Loja</span>
        </Link>

        <Link to="/profile" className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${currentPath === '/profile' ? 'text-primary-400 bg-primary-500/10' : 'text-white/40 hover:text-white/70'}`}>
          <UserCircle className={`w-5 h-5 mb-1 ${currentPath === '/profile' ? 'fill-primary-500/20' : ''}`} />
          <span className="text-[10px] font-medium font-inter">Perfil</span>
        </Link>

      </nav>
    </div>
  );
}
