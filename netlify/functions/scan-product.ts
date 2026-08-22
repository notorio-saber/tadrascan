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

    // Se a chave não existir, usamos o modo de demonstração prometido ao usuário.
    if (!apiKey) {
      console.log('Chave do Gemini não encontrada, usando modo demonstração...');
      return {
        statusCode: 200,
        body: JSON.stringify({ brand: 'Principia', name: 'Sérum Niacinamida', demo: true })
      };
    }

    // Inicializa a IA
    const ai = new GoogleGenAI({ apiKey });

    // O formato em Base64 recebido do frontend geralmente vem com o prefixo 'data:image/jpeg;base64,...'
    // Precisamos limpar esse prefixo para enviar a string pura para a API do Gemini.
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Prompt estrito para forçar a IA a responder em JSON estruturado
    const prompt = `
      Você é um especialista em cosméticos. Olhe para a foto da embalagem ou frasco deste produto.
      Identifique a marca (brand) e o nome comercial do produto (name).
      Me retorne APENAS um JSON válido com essas duas propriedades: "brand" e "name".
      Exemplo: {"brand": "La Roche-Posay", "name": "Effaclar Concentrado"}
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
    // Pode vir com marcação ```json, vamos limpar
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
        name: result.name || 'Desconhecido',
        demo: false
      })
    };

  } catch (error) {
    console.error('Erro no OCR:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao processar a imagem' })
    };
  }
};

export { handler };
