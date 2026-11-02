import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages, userProfile, userHistory } = JSON.parse(event.body || '{}');

    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Chave da IA não configurada no servidor.' }) 
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    // Monta contexto do perfil da usuária
    let profileContext = 'A usuária ainda não preencheu o teste de tipo de pele.';
    if (userProfile) {
      profileContext = `
- Tipo de Pele: ${userProfile.skinType || 'Não informado'}
- Fototipo: ${userProfile.phototype || 'Não informado'}
- Sensibilidade: ${userProfile.sensitivity === 'yes' ? 'Alta (queima/irrita fácil)' : userProfile.sensitivity === 'sometimes' ? 'Moderada' : 'Baixa'}
- Objetivos/Queixas: ${(userProfile.concerns || []).join(', ') || 'Rotina geral e viço'}
      `.trim();
    }

    // Histórico de produtos que ela já escaneou no app
    let historyContext = 'Nenhum produto escaneado ainda.';
    if (userHistory && userHistory.length > 0) {
      historyContext = userHistory.slice(0, 5).map((h: any) => 
        `- ${h.productName} (${h.brand || 'Marca não especificada'}) - Score: ${h.compatibilityScore}/100`
      ).join('\n');
    }

    const systemInstruction = `
Você é a **Dra. TADRA**, a dermatologista e especialista em estética regenerativa virtual do Instituto TADRA.
Sua comunicação é:
1. **Feminina, calorosa, acolhedora, sofisticada e altamente empática**, como uma dermatologista atenciosa de clínica premium conversando no consultório ou WhatsApp.
2. **Científica, precisa e segura**: você explica o porquê dos ativos de forma descomplicada (ex: niacinamida, ácido hialurônico, retinol, centella asiática, protetor solar).
3. **Personalizada**: use o perfil de pele e os produtos já escaneados pela usuária para formular suas recomendações.
4. **Formato de resposta**: use parágrafos concisos e fáceis de ler no celular, com emojis delicados (🌸, ✨, 💆‍♀️, 🧴). Quando adequado, sugira a ordem correta de aplicação (ex: Limpeza -> Tratamento -> Hidratação -> Proteção Solar).
5. **Aviso ético sutil**: se a usuária relatar lesões graves, infecções ou sintomas severos, recomende com carinho uma consulta presencial com a equipe médica da clínica Instituto TADRA.

DADOS DA PACIENTE:
${profileContext}

ÚLTIMOS PRODUTOS ESCANEADOS POR ELA:
${historyContext}
    `.trim();

    // Monta histórico de conversa
    const contents = (messages || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    if (contents.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nenhuma mensagem enviada.' }) };
    }

    let response;
    const modelCandidates = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError: any = null;

    for (const modelName of modelCandidates) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemInstruction}\n\n--- HISTÓRICO DA CONSULTA ---\n${(messages || []).map((m: any) => `${m.sender === 'user' ? 'Paciente' : 'Dra. TADRA'}: ${m.text}`).join('\n')}\n\nDra. TADRA:` }
              ]
            }
          ]
        });
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Tentativa com ${modelName} falhou:`, err?.message || err);
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('Nenhum modelo respondeu');
    }

    const reply = response.text || 'Olá, querida! Como posso cuidar da sua pele hoje? ✨';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };

  } catch (error: any) {
    console.error('Erro na Dra IA:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'A Dra. TADRA está atendendo muitas pacientes neste momento. Por favor, envie sua mensagem novamente em alguns instantes! 🌸' 
      })
    };
  }
};

export { handler };
