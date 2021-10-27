import {Client, Intents} from 'discord.js';
import MainController from "./controllers/MainController";

const bot = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]});
const mainController = new MainController();

mainController.subscribeBotEvents(bot);

void bot.login(process.env.BOT_TOKEN);
