import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const refineBio = async (currentBio: string): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
    You are an expert Cybersecurity Career Coach. 
    Refine the following professional biography for a GitHub portfolio. 
    It should be concise (100-150 words), professional, and highlight problem-solving skills, creativity, and a passion for offensive security.
    
    Current Draft:
    "${currentBio}"
    
    Output ONLY the refined bio text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || currentBio;
  } catch (error) {
    console.error("Error generating bio:", error);
    throw error;
  }
};

export const generateProjectSection = async (section: 'problem' | 'action' | 'outcome', context: string): Promise<string> => {
  const ai = getAiClient();
  let prompt = "";
  
  if (section === 'problem') {
    prompt = `Refine this 'Problem' statement for a cybersecurity project write-up. Focus on the security gap or business risk: "${context}"`;
  } else if (section === 'action') {
    prompt = `Refine this 'Action' statement for a cybersecurity project. Focus on the tools, methodology (e.g., OWASP), and techniques used (Red Teaming, Pentesting): "${context}"`;
  } else if (section === 'outcome') {
    prompt = `Refine this 'Outcome' statement. Focus on the remediation, impact, and value delivered to the client/organization: "${context}"`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || context;
  } catch (error) {
    console.error(`Error generating ${section}:`, error);
    throw error;
  }
};
