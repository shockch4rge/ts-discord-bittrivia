import { Client, Intents} from 'discord.js'
import MainController from "./controllers/MainController";
import { BOT_TOKEN } from "./auth.json";

const bot = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]});
const mainController = new MainController(bot);

mainController.subscribeBotEvents(bot);

void bot.login(BOT_TOKEN);
