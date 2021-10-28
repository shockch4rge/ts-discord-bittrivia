import {Client, Intents} from 'discord.js';
import BotHelper from "./helpers/BotHelper";
import {BOT_TOKEN} from "../auth.json";

const bot = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]});
const botHelper = new BotHelper(bot);

void bot.login(BOT_TOKEN);
