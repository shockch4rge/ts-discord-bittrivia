import { Client, Intents} from 'discord.js'
import {MainController} from "./MainController";
import { BOT_TOKEN } from "./auth.json";

const bot = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]});
const mainController = new MainController(bot);

mainController.subscribeBotEvents();

void bot.login(BOT_TOKEN);