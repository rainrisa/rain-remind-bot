import nodeCron from "node-cron";
import db from "./db.js";
import { Bot, InlineKeyboard } from "grammy";
import env from "./env.js";
import format from "../extra/format.js";

export class Cron {
  async activate(bot: Bot) {
    const job = nodeCron.schedule(env.CRON_PATTERN, async () => {
      const words = await db.getRandomTasks(5);
      env.ADMIN_IDS.forEach((adminId) => {
        const inlineKeyboard = new InlineKeyboard().text(
          "Generate sentence",
          "generate-sentence",
        );
        const reply_markup = env.OPENAI_API_KEY ? inlineKeyboard : undefined;
        bot.api.sendMessage(adminId, format(words), { reply_markup });
      });
    });
    job.start();

    return job;
  }
}
const cron = new Cron();

export default cron;
