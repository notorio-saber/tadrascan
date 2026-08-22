import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <header className="px-4 py-4 md:px-8 border-b border-tadra-wine/10 bg-tadra-bgSoft/90 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-xl font-playfair font-semibold text-tadra-wine tracking-tight">TADRA</h1>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
