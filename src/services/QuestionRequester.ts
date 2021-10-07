import axios from "axios";
import {QuestionRequest, TokenRequest} from "../../utils/types";

export default class QuestionRequester {
    private token: string = "";

    public constructor() {
        axios.get("https://opentdb.com/api_token.php?command=request")
            .then(result => this.token = (result.data as TokenRequest).token);
    }

    public async request() {
        const questionRequest = (await axios.get(`https://opentdb.com/api.php?amount=1&token=${this.token}`)).data as QuestionRequest;

        switch (questionRequest.response_code) {
            // Results returned successfully
            case 0:
                break;

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
                this.token = ((await axios.get(`https://opentdb.com/api_token.php?command=reset&token=${this.token}`)).data as TokenRequest).token;
                await this.request();
        }

        const result = questionRequest.results[0];

        if (!result) return;

        return result;
    }
}
