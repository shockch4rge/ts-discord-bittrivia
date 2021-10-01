import {MessageCollector, MessageCollectorOptions, TextBasedChannels} from "discord.js";

export class AnswerCollector extends MessageCollector {

    public constructor(channel: TextBasedChannels, options?: MessageCollectorOptions) {
        super(channel, options);
        this.initCollectorListeners(this)
    }

    private initCollectorListeners(collector: MessageCollector) {
        // filter is pre-defined; collected answer is always correct, so we stop collecting any new answers
        collector.on("collect", () => {
            collector.stop();
        });

        collector.on("end", collected => {
            console.log(collected.size);
        });
    }
}
