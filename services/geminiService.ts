import { GoogleGenAI, Type } from "@google/genai";
import type { Email } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeEmails = async (emails: Email[], filterKeywords: string, model: string): Promise<number[]> => {
  if (!process.env.API_KEY) {
    console.error("API key is not set.");
    alert("APIキーが設定されていません。");
    return [];
  }

  const emailDataForPrompt = emails.map(({ id, sender, subject, snippet }) => ({
    id,
    sender,
    subject,
    snippet,
  }));

  const promptParts = [
    `あなたはスマートなメールアシスタントです。以下のメールリストを分析し、不要なメールのIDのみをJSON配列で返してください。重要な通知や個人的なメッセージは除外してください。`,
    `\n分析の基準:`,
    `1. 内容が非常に似ている、または重複している冗長なメール。特に、同じ送信元からの複数の宣伝メール（例：「夏のセール」と「セール最終日」）。`,
    `2. 一般的な宣伝、スパム、勧誘メール（例：不動産投資、オンライン学習の勧誘）。`
  ];

  if (filterKeywords.trim()) {
    promptParts.push(`3. ユーザーが指定した以下のキーワードや送信者名に一致するメール: 「${filterKeywords}」`);
  }

  promptParts.push(`\nメールリスト:\n${JSON.stringify(emailDataForPrompt, null, 2)}`);

  const prompt = promptParts.join('\n');

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clutterEmailIds: {
              type: Type.ARRAY,
              description: "冗長、宣伝、または不要なメールのIDの配列。",
              items: {
                type: Type.NUMBER,
              },
            },
          },
          required: ["clutterEmailIds"],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    if (jsonResponse.clutterEmailIds && Array.isArray(jsonResponse.clutterEmailIds)) {
      return jsonResponse.clutterEmailIds;
    }
    console.warn("Gemini response did not match expected schema:", jsonResponse);
    return [];
  } catch (error) {
    console.error("Error calling or parsing Gemini API:", error);
    alert(`AIとの通信中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
};