# Rain Remind Bot

My personal reminder bot, mostly for Japanese vocabulary, This is a fork of [rainrisa/task-tracker-bot](https://github.com/rainrisa/task-tracker-bot) with cron feature

## Database Information

This project uses PostgreSQL as its database.

## Setup

To configure the bot, copy the `.env.example` file to create a `.env` file in the root directory. Then, fill in the variables with your own secrets.

Alternatively, you can just modify the environment fields in the [docker-compose.yml](https://github.com/rainrisa/task-tracker-bot/blob/main/docker-compose.yml) file and run:

```
docker compose up -d
```

## Usage

Here are the available commands:

- **/get**  
  Get the oldest undone task.

- **/get_all**  
  Get all undone tasks.

- **/random**  
  Get a random undone task.

- **/done [task IDs]**  
  Use this command to mark tasks as completed. For example,  
  `/done 1 2 3` will mark tasks 1, 2, and 3 as done.

- **/undone [task IDs]**  
  Use this command to mark tasks as incomplete. For example,  
  `/undone 2 3` will mark tasks 2 and 3 as undone while keeping task 1 marked as done.

To add a new task, just send your text message to the bot, and it will automatically be inserted into the database.

---

Feel free to use this and let me know if you need any further changes!
