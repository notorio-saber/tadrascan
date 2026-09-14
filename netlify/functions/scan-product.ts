import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imageBase64, userProfile } = JSON.parse(event.body || '{}');
    
    if (!imageBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nenhuma imagem enviada' }) };
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Chave do Gemini (VITE_GEMINI_API_KEY) não está configurada no ambiente.');
      return { statusCode: 500, body: JSON.stringify({ error: 'Serviço de Inteligência Artificial indisponível no momento.' }) };
    }

    const ai = new GoogleGenAI({ apiKey });
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const profileText = userProfile ? `
      Perfil de Pele da Usuária:
      - Tipo de pele: ${userProfile.skinType}
      - Pele sensível? ${userProfile.sensitivity === 'yes' ? 'Sim' : 'Não'}
      - Tendência à Acne? ${userProfile.acneProne === 'yes' ? 'Sim' : 'Não'}
      - Objetivos (Preocupações principais): ${userProfile.concerns?.join(', ') || 'Não especificado'}
    ` : 'Perfil da usuária não fornecido.';

    const prompt = `
      Você é um dermatologista virtual extremamente inteligente e um especialista em cosmetologia formulatória, como o aplicativo Vivino, mas para skincare.
      
      Vou te dar duas coisas:
      1. Uma foto de um produto cosmético (pode ser a frente do frasco ou a lista de ingredientes no verso).
      2. O Perfil de Pele de uma usuária.
      
      ${profileText}
      
      Sua Tarefa:
      1. Identifique o produto através da foto. 
      2. Descubra a formulação exata (lista INCI de ingredientes) dele. Se a foto for da lista INCI, extraia o texto (OCR). Se a foto for da frente do frasco, USE A SUA FERRAMENTA DE BUSCA NA WEB para pesquisar na internet a lista de ingredientes atualizada deste produto no Brasil.
      3. Calcule um 'compatibilityScore' (de 0 a 100) que representa o quão bem este produto se alinha EXCLUSIVAMENTE aos objetivos e restrições da usuária informada acima.
      
      Retorne APENAS um JSON válido e exato, sem blocos de markdown e sem explicações externas, com a seguinte estrutura:
      {
        "brand": "Nome da Marca",
        "name": "Nome Comercial do Produto",
        "ingredients": ["Ingrediente 1", "Ingrediente 2"],
        "compatibilityScore": 85,
        "productDescription": "Uma breve descrição elegante de para que serve este produto.",
        "positiveReasons": ["Motivo 1 pelo qual é bom para o perfil da usuária", "Motivo 2..."],
        "attentionPoints": ["Aviso de sensibilidade ou incompatibilidade com o perfil dela, se houver"],
        "howToUse": "Dica rápida de como encaixar na rotina (ex: usar pela manhã com protetor solar)."
      }
      
      Seja rigoroso no Score. Produtos que pioram a acne para quem tem tendência à acne devem ter nota baixa. Ingredientes irritantes para peles sensíveis devem diminuir o score drasticamente. Se o produto for perfeito para os objetivos, o score deve ser alto.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      tools: [{ googleSearch: {} }],
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64
              }
            }
          ]
        }
      ]
    });

    const text = response.text?.trim() || '{}';
    
    let cleanJsonStr = text;
    if (text.startsWith('```json')) {
      cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (text.startsWith('```')) {
      cleanJsonStr = text.replace(/```/g, '').trim();
    }

    const result = JSON.parse(cleanJsonStr);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        brand: result.brand || 'Desconhecida',
        name: result.name || 'Produto Desconhecido',
        ingredients: result.ingredients || [],
        compatibilityScore: typeof result.compatibilityScore === 'number' ? result.compatibilityScore : 50,
        productDescription: result.productDescription || '',
        positiveReasons: result.positiveReasons || [],
        attentionPoints: result.attentionPoints || [],
        howToUse: result.howToUse || '',
        aiGenerated: true
      })
    };

  } catch (error: any) {
    console.error('Erro no OCR/IA:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Falha na Inteligência Artificial: ${error.message}` })
    };
  }
};

export { handler };
