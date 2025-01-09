import { Prisma } from "@prisma/client";

export default function format(tasks: Prisma.TaskGetPayload<{}>[]) {
  return tasks.map((task) => `${task.text} [${task.id}]`).join("\n");
}
