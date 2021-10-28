import {Client, Collection, Guild, Message} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import fs from 'fs';
import path from 'path';
import InteractionHelper from "./InteractionHelper";
import BotCache from "../db/BotCache";
import SlashCommandDeployer from "./SlashCommandDeployer";
import GuildCache from "../db/GuildCache";
import ButtonHelper from "./ButtonHelper";


export default class BotHelper {
    public readonly bot: Client;
    public readonly botCache: BotCache;
    public readonly messageFiles: Collection<string, Message>;
    public readonly buttonFiles: Collection<string, iButtonFile>
    public readonly interactionFiles: Collection<string, iInteractionFile>;

    public constructor(bot: Client) {
        this.bot = bot;
        this.botCache = new BotCache(this.bot);

        this.messageFiles = new Collection();
        this.buttonFiles = new Collection();
        this.interactionFiles = new Collection();

        this.setupInteractionCommands();
        this.setupButtonCommands();
        this.setupBotEvents();
    }

    private setupBotEvents() {
        this.bot.on("ready", async bot => {
            console.log(`${bot.user.tag} is ready!`);

            const botGuilds = bot.guilds.cache.toJSON();

            for (const guild of botGuilds) {
                let cache: GuildCache | undefined;

                try {
                    cache = await this.botCache.getGuildCache(guild);
                } catch (err) {
                    console.error(`❌ Couldn't find ${guild.name}`);
                    continue;
                }

                try {
                    // setup slash commands for each guild
                    const deployer = new SlashCommandDeployer(guild.id, this.interactionFiles);
                    await deployer.deploy().catch(err => console.error(
                        // @ts-ignore -> err is unknown type
                        `Failed to deploy slash commands for Guild(${guild.name}): ${err.message}`
                    ));
                } catch (err) {
                    console.error(`❌ Couldn't deploy commands in ${guild.name}`);
                    continue;
                }

                console.log(`✅ Restored cache for ${guild.name}`);
            }
        });

        this.bot.on("messageCreate", async message => {
            if (message.author.bot) return;
            if (!message.guild!) return;

            if (/^\|ping/.test(message.content)) {
                await message.reply({content: `Pong! ${this.bot.ws.ping}ms`});
                return;
            }
        });

        this.bot.on("interactionCreate", async interaction => {
            if (!interaction.guild) return;
            const guildCache = await this.botCache.getGuildCache(interaction.guild);

            // Slash command
            if (interaction.isCommand()) {
                await interaction.deferReply({ephemeral: true}).catch(err => console.error(err.message));
                const interactionFile = this.interactionFiles.get(interaction.commandName);
                if (!interactionFile) return;

                const helper = new InteractionHelper(guildCache, interaction);

                try {
                    const file = interactionFile as iInteractionFile;

                    if (file.execute) {
                        await file.execute(helper);
                    }

                } catch (err) {
                    console.warn(err);
                    await interaction.followUp({
                        content: "There was an error executing this command!"
                    });
                }

            }

            // Button command
            if (interaction.isButton()) {
                await interaction.deferReply({ephemeral: true}).catch(err => console.error(err.message));
                const buttonFile = this.buttonFiles.get(interaction.customId);
                if (!buttonFile) return;

                const helper = new ButtonHelper(guildCache, interaction);

                try {
                    await buttonFile.execute(helper);

                } catch (err) {
                    console.warn(err);
                    await interaction.followUp({
                        content: "There was an error executing this button!"
                    });
                }
            }
        });
    }

    private setupInteractionCommands() {
        let units: string[];

        try {
            units = fs.readdirSync(path.join(__dirname, "../commands"));
        } catch {
            return;
        }

        for (const interactionFileNames of units.filter(file => BotHelper.isFile(file))) {
            const iInteractionFile = require(`../commands/${interactionFileNames}`) as iInteractionFile;
            this.interactionFiles.set(iInteractionFile.data.name, iInteractionFile);
        }
    }

    private setupButtonCommands() {
        let fileNames: string[];

        try {
            fileNames = fs.readdirSync(path.join(__dirname, "../buttons")).filter(file => BotHelper.isFile(file));
        } catch {
            return;
        }

        for (const buttonFileName of fileNames) {
            const buttonFile = require(`../buttons/${buttonFileName}`) as iButtonFile;
            this.buttonFiles.set(buttonFile.id, buttonFile);
        }
    }

    public static isFile(file: string) {
        return file.endsWith(".ts") || file.endsWith(".js");
    }
}

export type iInteractionFile = {
    data: SlashCommandBuilder,
    execute: (helper: InteractionHelper) => Promise<any>,
}

export type iButtonFile = {
    id: string,
    execute: (helper: ButtonHelper) => Promise<any>;
}
