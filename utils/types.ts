export type TokenRequest = {
    response_code: number,
    response_message: string,
    token: string
}

export type QuestionRequest = {
    response_code: number,
    results: QuestionData[]
}

export type QuestionData = {
    category: string,
    type: string,
    difficulty: string,
    question: string,
    correct_answer: string,
    incorrect_answers: string[],
}
