import { GuildMember } from "discord.js";
import { Level } from "../utilities/LevelCalculator";

export default class Player {
    public readonly member: GuildMember;
    public readonly data: PlayerData;

    /**
     *
     * @param member
     * @param data
     */
    public constructor(member: GuildMember, data: PlayerData) {
        this.member = member;
        this.data = data;
    }

    public static getEmptyData(): PlayerData {
        return {
            xp: 0,
            level: Level.ZERO,
            correct: 0,
            wrong: 0,
        } as PlayerData
    }
}

export interface PlayerData {
    xp: number;
    level: Level;
    correct: number;
    wrong: number;
}
