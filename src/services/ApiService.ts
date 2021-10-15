import axios from "axios";
import {QuestionRequest, TokenRequest} from "../utils/types";

export default class ApiService {
    private token: string | undefined;

    public async getQuestion() {
        const token = await this.getToken();
        const questionRequest = (await axios.get(`${URL.REQUEST_QUESTION}${token}`)).data as QuestionRequest;

        switch (questionRequest.response_code) {
            // Queried too many questions at once (max 50)
            case 1:
                throw new Error("Could not return results. The API doesn't have enough questions for your query.");

            // Invalid arguments given in url
            case 2:
                throw new Error("Contains an invalid parameter. Arguments passed in are not valid.");

            // Invalid token given
            case 3:
                throw new Error("Session Token does not exist.");

            // No more questions for current token; request for a reset
            case 4:
                // set new token and rerun the function
                this.token = await this.resetToken();
                await this.getQuestion();
                break;

            // Results returned successfully
            default:
                break;
        }

        // we only request 1 question
        return questionRequest.results[0];
    }

    private async getToken() {
        if (!this.token) {
            const tokenRequest = (await axios.get(URL.REQUEST_TOKEN)).data as TokenRequest
            this.token = tokenRequest.token;
        }

        return this.token;
    }

    private async resetToken() {
        if (!this.token) {
            return this.getToken();
        }

        const tokenRequest = (await axios.get(`${URL.RESET_TOKEN}${this.token}`)).data as TokenRequest
        this.token = tokenRequest.token;

        return this.token;
    }
}

export const URL = {
    RESET_TOKEN: "https://opentdb.com/api_token.php?command=reset&token=",
    REQUEST_TOKEN: "https://opentdb.com/api_token.php?command=request",
    REQUEST_QUESTION: "https://opentdb.com/api.php?amount=1&token=",
} as const
