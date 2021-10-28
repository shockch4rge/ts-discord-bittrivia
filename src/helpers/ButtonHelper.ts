import GuildCache from "../db/GuildCache";
import {ButtonInteraction} from "discord.js";

export default class ButtonHelper {
    public cache: GuildCache;
    public interaction: ButtonInteraction;

    public constructor(cache: GuildCache, interaction: ButtonInteraction) {
        this.cache = cache;
        this.interaction = interaction;
    }

    public respond(content: string) {
        this.interaction.followUp({content: content}).catch();
    }
}
