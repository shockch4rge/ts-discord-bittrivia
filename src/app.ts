import { Client, IntentsBitField } from "discord.js";

import { bot_token } from "../auth.json";
import BotHelper from "./helpers/BotHelper";

const bot = new Client({
    intents: [
        "GuildMessages",
        "Guilds",
        "GuildMembers",
    ],
});

const botHelper = new BotHelper(bot);
botHelper.setup();

void bot.login(bot_token);
