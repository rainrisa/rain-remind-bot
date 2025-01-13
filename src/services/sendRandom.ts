import { Bot, InlineKeyboard } from "grammy";
import db from "./db.js";
import env from "./env.js";
import format from "../extra/format.js";

export default async function sendRandom(bot: Bot) {
  const words = await db.getRandomTasks(5);
  env.ADMIN_IDS.forEach((adminId) => {
    const inlineKeyboard = new InlineKeyboard().text(
      "Generate sentence",
      "generate-sentence",
    );
    const reply_markup = env.OPENAI_API_KEY ? inlineKeyboard : undefined;
    bot.api.sendMessage(adminId, format(words), { reply_markup });
  });
}
