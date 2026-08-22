export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-tadra-bgDeep">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-tadra-wine/10 max-w-sm w-full">
        <h2 className="text-2xl font-playfair font-semibold text-tadra-wine text-center mb-6">TADRA</h2>
        <button className="w-full py-3 bg-tadra-bgSoft border border-tadra-wine/20 rounded-lg text-tadra-textStrong font-medium hover:bg-tadra-bgDeep transition-colors mb-4">
          Entrar com Google
        </button>
        <button className="w-full py-3 bg-tadra-wine text-white rounded-lg font-medium hover:bg-tadra-wine/90 transition-colors">
          Entrar com E-mail
        </button>
      </div>
    </div>
  );
}
