import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-playfair font-semibold text-tadra-textStrong mb-2">
        Inteligência para sua pele.
      </h2>
      <p className="text-tadra-textSoft mb-8">
        Escaneie. Entenda. Escolha o melhor para sua pele.
      </p>
      
      <div className="bg-white/60 p-6 rounded-2xl shadow-sm border border-tadra-wine/5">
        <p className="text-sm font-geist text-tadra-textSoft mb-4">Descubra se o produto combina com você.</p>
        
        <Link to="/scan" className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-tadra-wine text-white rounded-xl font-medium hover:bg-tadra-wine/90 transition-colors mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Escanear Embalagem
        </Link>

        <div className="text-center">
          <Link to="/analyze" className="text-sm font-geist text-tadra-textSoft hover:text-tadra-wine hover:underline">
            Ou digitar ingredientes manualmente
          </Link>
        </div>
      </div>
    </div>
  );
}
