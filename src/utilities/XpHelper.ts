export default class XpHelper {
    public static baseXp = 25;

    public static calculateLevel(xp: number): { level: Level, remainder: number } {
        const level = xp / XpHelper.baseXp as Level;
        const remainder = xp % XpHelper.baseXp;

        return { level, remainder };
    }

    public static getXp(from: Level, to: Level): number {
        return from - to;
    }
}

export enum Level {
    Zero = 0,
    One = 25,
    Two = 75,
    Three = 150,
    Four = 225,
    Five = 300,
    Six = 400,
    Seven = 550,
    Eight = 700,
    Nine = 850,
    Ten = 1000,
}
