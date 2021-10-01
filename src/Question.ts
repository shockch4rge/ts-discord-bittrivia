import {Message, TextBasedChannels} from "discord.js";

export class Question {
    public readonly content: string;
    public readonly answers: string[];

    public constructor(options: QuestionOptions) {
        this.content = options.content;
        this.answers = options.answers;
    }

    // Send the question to the channel
    // idk if this should be here
    public async ask(channel: TextBasedChannels): Promise<Message> {
        return await channel.send({content: this.content});
    }

    // Check if at least one answer is correct
    public checkCorrect(answer: string): boolean {
        return this.answers.some(ans => new RegExp(ans).test(answer));
    }
}

export interface QuestionOptions {
    content: string,
    answers: string[],
}
