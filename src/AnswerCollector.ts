import {MessageCollector, MessageCollectorOptions, TextBasedChannels} from "discord.js";

export default class AnswerCollector extends MessageCollector {

    public constructor(channel: TextBasedChannels, options?: MessageCollectorOptions) {
        super(channel, options);
    }

    public start() {
        // collected answer is always correct, so we stop collecting any new answers
        this.on("collect", () => {
            this.stop();
        });

        this.on("end", collected => {
            console.log(collected.size);
        });
    }
}
