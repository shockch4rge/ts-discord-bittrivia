export default class XpHelper {
    public static questionXp = 25;

    public static getLevelFromXp(xp: number): { level: Level, remainder: number } {
        const level = xp / XpHelper.questionXp as Level;
        const remainder = xp % XpHelper.questionXp;

        return { level: level, remainder: remainder };
    }

    public static getXp(from: Level, to: Level): number {
        return from - to;
    }
}

export enum Level {
    ZERO = 0,
    ONE = 25,
    TWO = 75,
    THREE = 150,
    FOUR = 225,
    FIVE = 300,
    SIX = 400,
    SEVEN = 550,
    EIGHT = 700,
    NINE = 850,
    TEN = 1000,
}
