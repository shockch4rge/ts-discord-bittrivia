import { Client, Intents } from 'discord.js';
import BotHelper from "./helpers/BotHelper";
import { bot_token } from "../auth.json";

const bot = new Client({
    intents: [
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
});

const botHelper = new BotHelper(bot);
botHelper.setup();

void bot.login(bot_token);
