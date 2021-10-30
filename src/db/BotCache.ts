import GuildCache from "./GuildCache";
import { Client, Collection, Guild } from "discord.js";

export default class BotCache {
    public bot: Client;
    public guilds: Collection<string, GuildCache>

    public constructor(bot: Client) {
        this.bot = bot;
        this.guilds = new Collection();
    }

    public getGuildCache(guild: Guild): Promise<GuildCache> {
        return new Promise<GuildCache>((resolve, reject) => {
            let cache = this.guilds.get(guild.id);

            if (!cache) {
                // guild doesn't exist locally; add it
                cache = new GuildCache(this.bot, guild);
                this.guilds.set(guild.id, cache);
            }

            resolve(cache);
        });
    }
}
