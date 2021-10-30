import axios from "axios";
import { QuestionCategory, QuestionData, QuestionDifficulty } from "../models/Question";

export default class TriviaService {
    private token: string | undefined;

    public async getQuestion(category: QuestionCategory, difficulty: QuestionDifficulty) {
        const token = await this.getToken();

        const questionRequest = (
            await axios.get(`https://opentdb.com/api.php?amount=1&token=${token}&category=${category}&difficulty=${difficulty}`)
        ).data as QuestionRequest;

        switch (questionRequest.response_code) {
            case 1:
                throw new Error("Could not return results. The API doesn't have enough questions for your query."); // max 50

            case 2:
                throw new Error("Contains an invalid parameter. Arguments passed in are not valid.");

            case 3:
                throw new Error("Session Token does not exist. Invalid token?"); // invalid token

            // No more questions for current token; request for a reset
            case 4:
                // set new token and rerun the function
                this.token = await this.resetToken();
                await this.getQuestion(category, difficulty);

                break;

            // Results returned successfully
            default:
                break;
        }

        // we only request 1 question
        return questionRequest.results[0] as QuestionData;
    }

    private async getToken() {
        if (!this.token) {
            const tokenRequest = (await axios.get("https://opentdb.com/api_token.php?command=request")).data as TokenRequest
            this.token = tokenRequest.token;
        }

        return this.token;
    }

    private async resetToken() {
        if (!this.token) {
            return this.getToken();
        }

        const tokenRequest = (await axios.get(`https://opentdb.com/api_token.php?command=reset&token=${this.token}`)).data as TokenRequest
        this.token = tokenRequest.token;

        return this.token;
    }
}

export type TokenRequest = {
    response_code: number,
    response_message: string,
    token: string,
}

export type QuestionRequest = {
    response_code: number,
    results: QuestionData[],
}
