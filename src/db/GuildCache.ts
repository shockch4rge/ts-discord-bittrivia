import {Client, Guild} from "discord.js";
import TriviaService from "../services/TriviaService";

export default class GuildCache {
    public readonly bot: Client;
    public readonly guild: Guild;
    public readonly service: TriviaService;

    public constructor(bot: Client, guild: Guild) {
        this.bot = bot;
        this.guild = guild;
        this.service = new TriviaService();
    }
}
