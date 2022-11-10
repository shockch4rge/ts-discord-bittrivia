import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";

import GuildCache from "../db/GuildCache";
import { InteractionHelper } from "../utilities/InteractionHelper";

export default class CommandInteractionHelper extends InteractionHelper<ChatInputCommandInteraction> {
    public constructor(cache: GuildCache, interaction: ChatInputCommandInteraction) {
        super(cache, interaction);
    }

    public async respond(content: string) {
        await this.interaction.followUp({ content: content, ephemeral: true }).catch(() => { });
    }

    public getInteractionMentionable(name: string) {
        return this.interaction.options.getMentionable(name);
    }

    public getInteractionChannel(name: string) {
        return this.interaction.options.getChannel(name);
    }

    public getInteractionRole(name: string) {
        return this.interaction.options.getRole(name);
    }

    public getInteractionUser(name: string) {
        return this.interaction.options.getUser(name);
    }

    public getInteractionString(name: string) {
        return this.interaction.options.getString(name);
    }

    public getInteractionInteger(name: string) {
        return this.interaction.options.getInteger(name);
    }

    public getInteractionBoolean(name: string) {
        return this.interaction.options.getBoolean(name);
    }
}
