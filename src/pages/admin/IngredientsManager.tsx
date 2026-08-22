import { useEffect, useState } from 'react';
import { Ingredient } from '../../../types/database';
import { getIngredients } from '../../../services/firestore/ingredients';
import { seedInitialIngredients } from '../../../utils/seedData';

export default function IngredientsManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchIngredients() {
    setLoading(true);
    try {
      const data = await getIngredients();
      setIngredients(data);
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleSeed = async () => {
    if (window.confirm('Deseja importar os ingredientes iniciais?')) {
      await seedInitialIngredients();
      fetchIngredients();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestão de Ingredientes</h2>
        <div className="space-x-3">
          <button 
            onClick={handleSeed}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Importar Iniciais
          </button>
          <button className="px-4 py-2 bg-tadra-wine text-white rounded-md hover:bg-tadra-wine/90">
            Novo Ingrediente
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nome INCI</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500" colSpan={3}>
                  Carregando...
                </td>
              </tr>
            ) : ingredients.length === 0 ? (
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500" colSpan={3}>
                  Nenhum ingrediente cadastrado ainda.
                </td>
              </tr>
            ) : (
              ingredients.map((ing) => (
                <tr key={ing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{ing.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {ing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline">
                    Editar
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
