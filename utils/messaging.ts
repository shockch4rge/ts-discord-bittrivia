import {EmojiIdentifierResolvable, Message, TextBasedChannels} from "discord.js";
import Question from "../src/models/Question";
import {createEmbed, CreateEmbedOptions, delay} from "./utils";

export async function sendMessage(channel: TextBasedChannels, content: CreateEmbedOptions) {
    const embed = createEmbed(content);
    return await channel.send({ embeds: [embed] }).catch();
}

export async function askQuestion(channel: TextBasedChannels, question: Question) {
    await sendMessage(channel, {
        title: question.content,
        fields: [
            {name: "Category", value: question.category, inline: true},
            {name: "Type", value: question.type, inline: true},
            {name: "Difficulty", value: question.difficulty, inline: true},
            {name: "1", value: question.allAnswers[0]},
            {name: "2", value: question.allAnswers[1]},
            {name: "3", value: question.allAnswers[2]},
            {name: "4", value: question.allAnswers[3]},
        ],
        footer: "❗ There is only 1 correct answer."
    });
}

export async function sendWarning(channel: TextBasedChannels, content: string) {
    const embed = createEmbed({ author: content, level: MessageLevel.WARNING });
    return await channel.send({ embeds: [embed] }).catch();
}

export async function deleteMessages(messages: Message[], wait?: number, interval?: number) {
    await delay(wait ?? 5000);
    for (const message of messages) {
        await delay(interval ?? 0);
        await message.delete().catch();
    }
}

export async function handleError(message: Message, reason: string, reaction?: EmojiIdentifierResolvable) {
    await message.react(reaction ?? "").catch();
    const warning = await sendWarning(message.channel, reason);
    await deleteMessages([warning, message]);
}

export enum MessageLevel
{
    WARNING = "RED",
    SUCCESS = "GREEN",
    PROMPT = "#DCBDFB",
    NOTIFY = "YELLOW",
    DEFAULT = "#2F3136",
}
