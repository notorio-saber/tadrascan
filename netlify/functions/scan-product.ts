import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const handler: Handler = async (event, context) => {
  // Apenas aceita requisições POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imageBase64 } = JSON.parse(event.body || '{}');
    
    if (!imageBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nenhuma imagem enviada' }) };
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Chave do Gemini (VITE_GEMINI_API_KEY) não está configurada no ambiente.');
      return { statusCode: 500, body: JSON.stringify({ error: 'Serviço de Inteligência Artificial indisponível no momento.' }) };
    }

    // Inicializa a IA
    const ai = new GoogleGenAI({ apiKey });

    // O formato em Base64 recebido do frontend geralmente vem com o prefixo 'data:image/jpeg;base64,...'
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Prompt estrito para forçar a IA a retornar o produto completo, incluindo ingredientes
    const prompt = `
      Você é um especialista em formulações de cosméticos e dermatologia.
      Olhe para a foto da embalagem deste produto.
      Identifique o produto, busque em sua base de conhecimento qual é a composição exata (lista INCI de ingredientes) dele.
      Me retorne APENAS um JSON válido contendo:
      - "brand": A marca do produto.
      - "name": O nome comercial do produto.
      - "ingredients": Um array de strings, contendo a lista completa de ingredientes.
      
      Exemplo:
      {
        "brand": "Sol de Janeiro",
        "name": "Bumbum Cream",
        "ingredients": ["Aqua", "Glycerin", "Mica", "Caffeine"]
      }
      
      Se não tiver certeza absoluta da composição, faça o melhor palpite educado baseado no tipo de produto.
      Não adicione blocos de markdown ou texto extra, apenas o JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
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
    
    // Tenta fazer o parse do JSON retornado pela IA
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
        aiGenerated: true
      })
    };

  } catch (error: any) {
    console.error('Erro no OCR:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Falha no OCR: ${error.message}` })
    };
  }
};

export { handler };
