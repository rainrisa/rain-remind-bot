import nodeCron from "node-cron";
import db from "./db.js";
import { Task } from "@prisma/client";
import { Bot } from "grammy";
import env from "./env.js";
import format from "../extra/format.js";

export class Cron {
  async getWords() {
    const wordPerCron = 5;
    // prisma does not support this so we have to use a raw query
    // https://github.com/prisma/prisma/issues/5894
    return db.prisma.$queryRaw<
      Task[]
    >`SELECT * FROM "Task" WHERE done = false ORDER BY random() LIMIT ${wordPerCron};`;
  }

  async activate(bot: Bot) {
    nodeCron
      .schedule(env.CRON_PATTERN, async () => {
        const words = await this.getWords();
        env.ADMIN_IDS.forEach((adminId) =>
          bot.api.sendMessage(adminId, format(words)),
        );
      })
      .start();
  }
}
const cron = new Cron();

export default cron;
