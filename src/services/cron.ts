import nodeCron from "node-cron";
import { Bot } from "grammy";
import env from "./env.js";
import sendRandom from "./sendRandom.js";

export class Cron {
  async activate(bot: Bot) {
    const job = nodeCron.schedule(env.CRON_PATTERN, async () => {
      sendRandom(bot);
    });
    job.start();

    return job;
  }
}
const cron = new Cron();

export default cron;
