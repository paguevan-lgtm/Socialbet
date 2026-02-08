import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBetTerms = async (title: string, amount: number): Promise<string> => {
  if (!apiKey) return "Termos gerados automaticamente indisponíveis (Chave API ausente).";

  try {
    const prompt = `
      Você é um advogado de apostas sociais engraçado e sarcástico.
      Crie um parágrafo curto (máximo 40 palavras), soando "oficial" mas cômico,
      para uma aposta entre amigos com o título: "${title}" valendo R$ ${amount}.
      Use termos como "Vossas Senhorias", "O Pacto", etc.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Termos da aposta definidos pelos participantes.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro ao gerar os termos. Prossiga com cuidado!";
  }
};

export const judgeProof = async (proofDescription: string, betTitle: string): Promise<string> => {
  if (!apiKey) return "IA Juiz indisponível.";

  try {
    const prompt = `
      Atue como um Juiz de Apostas Imparcial e Sábio.
      A aposta era: "${betTitle}".
      A prova apresentada foi descrita como: "${proofDescription}".
      Dê um veredito preliminar de 1 frase dizendo se parece que a pessoa ganhou ou perdeu, ou se precisa de mais provas. Seja direto.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Análise inconclusiva.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "O juiz robô está tirando um cochilo.";
  }
};
