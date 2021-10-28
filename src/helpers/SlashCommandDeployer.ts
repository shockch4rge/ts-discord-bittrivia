import {SlashCommandBuilder} from "@discordjs/builders";
import {REST} from "@discordjs/rest";
import {BOT_TOKEN, APP_ID} from "../../auth.json";
import {Routes} from "discord-api-types/v9";

export default class SlashCommandDeployer {
    private readonly guildId: string;
    private readonly commands: SlashCommandBuilder[];

    public constructor(guildId: string) {
        this.guildId = guildId;
        this.commands = [];

    }

    public addCommand(command: SlashCommandBuilder) {
        this.commands.push(command);
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
