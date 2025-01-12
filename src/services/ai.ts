import OpenAI from "openai";
import env from "./env.js";

export class AI {
  client: OpenAI;

  constructor(apiKey: string, baseURL?: string) {
    this.client = new OpenAI({ apiKey, baseURL });
  }

  async ask(question: string) {
    const chatCompletion = await this.client.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: "gpt-4o-mini",
    });
    const answer = chatCompletion.choices[0].message.content;

    return answer;
  }
}
const ai = env.OPENAI_API_KEY
  ? new AI(env.OPENAI_API_KEY, env.OPENAI_BASE_URL)
  : undefined;

export default ai;
