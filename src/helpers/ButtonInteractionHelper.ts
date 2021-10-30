import GuildCache from "../db/GuildCache";
import { ButtonInteraction } from "discord.js";
import { InteractionHelper } from "../utilities/InteractionHelper";

export default class ButtonInteractionHelper extends InteractionHelper<ButtonInteraction> {
    public constructor(cache: GuildCache, interaction: ButtonInteraction) {
        super(cache, interaction);
    }

    public async respond(content: string): Promise<void> {
        await this.interaction.followUp({content: content});
    }
}
