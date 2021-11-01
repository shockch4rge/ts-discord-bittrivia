import { shuffle } from "../utilities/utils";
import he from "he";

export class Question {
    public readonly content: string;
    public readonly correctAnswer: string;
    public readonly wrongAnswers: string[];
    public readonly allAnswers: string[];
    public readonly category: string;
    public readonly type: string;
    public readonly difficulty: string;

    public constructor(data: QuestionData) {
        // decode all properties as data received is encoded
        this.content = he.decode(data.question);
        this.correctAnswer = he.decode(data.correct_answer);
        this.wrongAnswers = data.incorrect_answers.map(answer => he.decode(answer));
        // randomise correct answer + wrong answers
        this.allAnswers = shuffle(this.wrongAnswers.concat(this.correctAnswer));
        this.category = he.decode(data.category);
        this.type = he.decode(data.type);
        this.difficulty = he.decode(data.difficulty);
    }

    public checkCorrect(answer: string) {
        return new RegExp(this.correctAnswer).test(answer);
    }
}

export enum QuestionCategory {
    ANY = 0,
    GENERAL_KNOWLEDGE = 9,
    BOOKS,
    FILM,
    MUSIC,
    MUSICALS_AND_THEATRE,
    TELEVISION,
    VIDEO_GAMES,
    BOARD_GAMES,
    NATURE,
    COMPUTERS,
    MATHEMATICS,
    MYTHOLOGY,
    SPORTS,
    GEOGRAPHY,
    HISTORY,
    POLITICS,
    ART,
    CELEBRITIES,
    ANIMALS,
    VEHICLES,
    COMICS,
    GADGETS,
    ANIME,
    CARTOON
}

export enum QuestionDifficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
    ANY = ""
}

export type QuestionData = {
    category: string,
    type: string,
    difficulty: QuestionDifficulty,
    question: string,
    correct_answer: string,
    incorrect_answers: string[],
}
