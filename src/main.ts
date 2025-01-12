import { Bot } from "grammy";
import env from "./services/env.js";
import { BotCommand } from "grammy/types";
import db from "./services/db.js";
import format from "./extra/format.js";
import disablePreview from "./plugins/disablePreview.js";
import cron from "./services/cron.js";
import ai from "./services/ai.js";

const bot = new Bot(env.BOT_TOKEN);
const commands: BotCommand[] = [
  { command: "get", description: "Get oldest undone task" },
  { command: "get_all ", description: "Get all undone tasks" },
  { command: "random", description: "Get random undone task" },
  { command: "done", description: "Mark a task as done" },
  { command: "undone", description: "Mark a task as undone" },
  { command: "delete", description: "Remove a task" },
];
bot.use((ctx, next) => {
  const fromId = ctx.from?.id;

  if (fromId && env.ADMIN_IDS.includes(fromId)) {
    return next();
  }
  return ctx.reply("Sorry you are not the admin");
});
bot.api.config.use(disablePreview);
cron.activate(bot);

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Hi, check out the following commands:\n\n" +
      commands.map((command) => "/" + command.command).join("\n"),
  );
});
bot.command("get", async (ctx) => {
  const task = await db.getOldestTask();
  task && (await ctx.reply(format([task])));
});
bot.command("get_all", async (ctx) => {
  const tasks = await db.getAllTasks();
  tasks.length && (await ctx.reply(format(tasks)));
});
bot.command("random", async (ctx) => {
  const task = await db.getRandomTask();
  task && (await ctx.reply(format([task])));
});
bot.command("done", async (ctx) => {
  const ids = ctx.message?.text.split(" ").slice(1).map(Number) || [];
  await Promise.all(ids.map((id) => db.markAsDone(id)));
  await ctx.reply("Ok");
});
bot.command("undone", async (ctx) => {
  const ids = ctx.message?.text.split(" ").slice(1).map(Number) || [];
  await Promise.all(ids.map((id) => db.markAsUndone(id)));
  await ctx.reply("Ok");
});
bot.command("delete", async (ctx) => {
  const ids = ctx.message?.text.split(" ").slice(1).map(Number) || [];
  await Promise.all(ids.map((id) => db.deleteTask(id)));
  await ctx.reply("Ok");
});
bot.on("msg:text", async (ctx) => {
  const text = ctx.message?.text;
  const task = text && (await db.addTask(text));
  task && (await ctx.reply(format([task])));
});
bot.on("callback_query", async (ctx) => {
  if (ctx.callbackQuery.data === "generate-sentence") {
    const message = ctx.callbackQuery.message;

    if (message) {
      const instruction =
        env.PROMPT_TEXT ||
        "Generate english text using these vocabularies.\n" +
          "Just send me the text without anything else";
      const sentence = await ai?.ask(message.text + "\n\n" + instruction);

      await ctx.api.editMessageText(
        message.chat.id,
        message.message_id,
        message.text + "\n\n" + sentence,
      );
    }
  }
});
bot.api.setMyCommands(commands);
bot.start();
