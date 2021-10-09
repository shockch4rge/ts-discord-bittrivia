import {QuestionData} from "../utils/types";
import {shuffle} from "../utils/utils";
import he from "he";

export default class Question {
    public readonly content: string;
    public readonly correctAnswer: string;
    public readonly wrongAnswers: string[];
    public readonly allAnswers: string[];
    public readonly category: string;
    public readonly type: string;
    public readonly difficulty: string;

    public constructor(data: QuestionData) {
        this.content = he.decode(data.question);
        this.correctAnswer = he.decode(data.correct_answer);
        // decode every wrong answer
        this.wrongAnswers = data.incorrect_answers.map(answer => he.decode(answer));
        // combine correct and wrong answers and shuffle them for randomness
        this.allAnswers = shuffle(this.wrongAnswers.concat(this.correctAnswer));
        this.category = he.decode(data.category);
        this.type = he.decode(data.type);
        this.difficulty = he.decode(data.difficulty);
    }

    // Check if the answer is correct
    public checkCorrect(answer: string) {
        // get numeric form in case user decides to answer with number
        const ans: number = Number.parseInt(answer) - 1;
        const correctIndex = this.allAnswers.indexOf(this.correctAnswer);
        const correctString = this.correctAnswer.toLowerCase();

        /*
            In this case, the user can answer with either the index
            or the literal string of the answer.
         */
        const isCorrectIndex = !Number.isNaN(ans) && ans === correctIndex;
        const isCorrectString = new RegExp(correctString).test(answer);

        return isCorrectIndex || isCorrectString;
    }
}
