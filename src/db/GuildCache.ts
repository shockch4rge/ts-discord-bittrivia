import {Client, Guild} from "discord.js";
import ApiService from "../services/ApiService";

export default class GuildCache {
    public bot: Client;
    public guild: Guild;
    public service?: ApiService;

    public constructor(bot: Client, guild: Guild) {
        this.bot = bot;
        this.guild = guild;
    }

}
