import {QuestionData} from "../../utils/types";
import {shuffle} from "../../utils/utils";
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
        this.wrongAnswers = data.incorrect_answers.map(answer => he.decode(answer));
        this.allAnswers = shuffle(this.wrongAnswers.concat(this.correctAnswer));
        this.category = he.decode(data.category);
        this.type = he.decode(data.type);
        this.difficulty = he.decode(data.difficulty);
    }

    // Check if the answer is correct
    public checkCorrect(answer: number) {
        const correctIndex = this.allAnswers.indexOf(this.correctAnswer);
        return !Number.isNaN(answer) && answer === correctIndex;
    }
}
