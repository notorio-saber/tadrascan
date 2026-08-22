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
        <p className="text-sm font-geist text-tadra-textSoft">Área de Análise</p>
        <button className="mt-4 px-6 py-3 bg-tadra-wine text-white rounded-full font-medium hover:bg-tadra-wine/90 transition-colors">
          Analisar Produto
        </button>
      </div>
    </div>
  );
}
