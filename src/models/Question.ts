import he from "he";

import { shuffle } from "../utilities/utils";

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

    public check(answer: string) {
        return new RegExp(this.correctAnswer).test(answer);
    }
}

export enum QuestionCategory {
    Any = 0,
    GeneralKnowledge = 9,
    Books,
    Film,
    Music,
    MusicalsAndTheatre,
    Television,
    VideoGames,
    BoardGames,
    Nature,
    Computers,
    Mathematics,
    Mythology,
    Sports,
    Geography,
    History,
    Politics,
    Art,
    Celebrities,
    Animals,
    Vehicles,
    Comics,
    Gadgets,
    Anime,
    Cartoon
}

export enum QuestionDifficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
    Any = ""
}

export type QuestionData = {
    category: string,
    type: string,
    difficulty: QuestionDifficulty,
    question: string,
    correct_answer: string,
    incorrect_answers: string[],
}
