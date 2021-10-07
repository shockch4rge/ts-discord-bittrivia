import {
    ColorResolvable,
    EmbedFieldData,
    MessageEmbed,
} from "discord.js";
import {MessageLevel} from "./messaging";

export async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

/**
 *
 * @param opts Options for constructing the embed.
 * @returns A new {@link MessageEmbed}.
 */
export function createEmbed(opts: CreateEmbedOptions) {
    // Falsy values are allowed here as Discord will just evaluate them as being empty fields.
    return new MessageEmbed()
        .setAuthor(opts.author ?? "", "")
        .setColor(opts.level ?? MessageLevel.DEFAULT)
        .setTitle(opts.title ?? "")
        .setDescription(opts.description ?? "")
        .setURL(opts.url ?? "")
        .setFields(opts.fields ?? [])
        .setImage(opts.imageUrl ?? "")
        .setThumbnail(opts.thumbnailUrl ?? "")
        .setFooter(opts.footer ?? "");
}

export interface CreateEmbedOptions {
    author?: string,
    level?: ColorResolvable,
    title?: string,
    description?: string,
    url?: string,
    fields?: EmbedFieldData[],
    imageUrl?: string,
    thumbnailUrl?: string,
    footer?: string,
}
