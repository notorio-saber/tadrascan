export default function Onboarding() {
  return (
    <div className="p-6 md:p-12 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-playfair font-semibold text-tadra-textStrong mb-4">
        Descubra sua pele
      </h2>
      <p className="text-tadra-textSoft mb-8">
        Responda algumas perguntas rápidas para personalizarmos sua análise.
      </p>
      
      <div className="bg-white/60 p-6 rounded-2xl shadow-sm border border-tadra-wine/5">
        <p className="text-sm font-geist text-tadra-textSoft mb-4">Qual sua faixa etária?</p>
        <div className="flex gap-2 flex-wrap">
          <button className="px-4 py-2 bg-tadra-bgSoft border border-tadra-wine/20 rounded-full text-sm text-tadra-textStrong hover:bg-tadra-wine hover:text-white transition-colors">
            Menos de 20
          </button>
          <button className="px-4 py-2 bg-tadra-bgSoft border border-tadra-wine/20 rounded-full text-sm text-tadra-textStrong hover:bg-tadra-wine hover:text-white transition-colors">
            20 a 30
          </button>
          <button className="px-4 py-2 bg-tadra-bgSoft border border-tadra-wine/20 rounded-full text-sm text-tadra-textStrong hover:bg-tadra-wine hover:text-white transition-colors">
            31 a 40
          </button>
          <button className="px-4 py-2 bg-tadra-bgSoft border border-tadra-wine/20 rounded-full text-sm text-tadra-textStrong hover:bg-tadra-wine hover:text-white transition-colors">
            Mais de 40
          </button>
        </div>
      </div>
    </div>
  );
}
