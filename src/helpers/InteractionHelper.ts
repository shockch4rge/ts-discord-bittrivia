import {CommandInteraction} from "discord.js";
import GuildCache from "../db/GuildCache";

export default class InteractionHelper {
    public readonly cache: GuildCache;
    public readonly interaction: CommandInteraction;

    public constructor(cache: GuildCache, interaction: CommandInteraction) {
        this.cache = cache;
        this.interaction = interaction;
    }

    public respond(content: string) {
        this.interaction.followUp({content: content, ephemeral: true}).catch();
    }

    public getInteractionMentionable(name: string) {
        return this.interaction.options.getMentionable(name)
    }

    public getInteractionChannel(name: string) {
        return this.interaction.options.getChannel(name)
    }

    public getInteractionRole(name: string) {
        return this.interaction.options.getRole(name)
    }

    public getInteractionUser(name: string) {
        return this.interaction.options.getUser(name)
    }

    public getInteractionString(name: string) {
        return this.interaction.options.getString(name)
    }

    public getInteractionInteger(name: string) {
        return this.interaction.options.getInteger(name)
    }

    public getInteractionBoolean(name: string) {
        return this.interaction.options.getBoolean(name)
    }
}
