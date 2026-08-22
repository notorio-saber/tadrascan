export default function ProductsManager() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestão de Produtos</h2>
        <button className="px-4 py-2 bg-tadra-wine text-white rounded-md hover:bg-tadra-wine/90">
          Novo Produto
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nome / Marca</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-500" colSpan={3}>
                Nenhum produto cadastrado ainda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
