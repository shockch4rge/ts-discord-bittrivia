import {iButtonFile} from "../helpers/BotHelper";
import {MessageButton} from "discord.js";

module.exports = {
    id: "answer",
    execute: async helper => {
        const question = helper.cache.service!.question!;
        const button = helper.interaction.component as MessageButton

        if (question.checkCorrect(button.label!)) {
            await helper.interaction.editReply({content: "✅  You got the correct answer!"});
        }
        else {
            await helper.interaction.editReply({content: "❌  dumbass that was the correct answer"});
        }
    }

} as iButtonFile;
