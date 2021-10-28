import {SlashCommandBuilder} from "@discordjs/builders";
import {REST} from "@discordjs/rest";
import {BOT_TOKEN, APP_ID} from "../../auth.json";
import {Routes} from "discord-api-types/v9";
import {Collection} from "discord.js";
import {iInteractionFile} from "./BotHelper";

export default class SlashCommandDeployer {
    private readonly guildId: string;
    private readonly commands: SlashCommandBuilder[];
    private readonly interactionFiles: Collection<string, iInteractionFile>

    public constructor(guildId: string, interactionFiles: Collection<string, iInteractionFile>) {
        this.guildId = guildId;
        this.commands = [];
        this.interactionFiles = interactionFiles;

        this.interactionFiles.forEach(command => this.commands.push(command.data));
    }

    public async deploy() {
        const rest = new REST({version: "9"}).setToken(BOT_TOKEN)
        await rest.put(
            Routes.applicationGuildCommands(APP_ID, this.guildId),
            {
                body: this.commands.map(command => command.toJSON())
            }
        );
    }
}
