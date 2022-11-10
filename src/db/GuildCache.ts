import { Client, Guild, GuildMember } from "discord.js";
import { firestore } from "firebase-admin";

import Player, { PlayerData } from "../models/Player";
import TriviaService from "../services/TriviaService";
import XpHelper from "../utilities/XpHelper";

import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;
import FieldValue = firestore.FieldValue;

export default class GuildCache {
    public readonly bot: Client;
    public readonly guild: Guild;
    public readonly playerRefs: CollectionReference<DocumentData>;
    public readonly service: TriviaService;

    public constructor(bot: Client, guild: Guild, playerRefs: CollectionReference<DocumentData>) {
        this.bot = bot;
        this.guild = guild;
        this.playerRefs = playerRefs;
        this.service = new TriviaService();
    }

    public async getPlayerData(id: string) {
        if (!await this.isRegistered(id)) {
            throw new Error("Player is not registered!");
        }

        const snap = await this.playerRefs.doc(id).get();
        return snap.data() as PlayerData;
    }

    public async incrementStats(playerId: string) {
        const playerRef = this.playerRefs.doc(playerId);

        const xp = (await playerRef.get()).get("xp");
        const { level } = XpHelper.calculateLevel(xp);

        return playerRef.update({
            level: level,
            xp: FieldValue.increment(XpHelper.baseXp),
            correct: FieldValue.increment(1),
        });
    }

    public async decrementStats(playerId: string) {
        const playerRef = this.playerRefs.doc(playerId);

        return playerRef.update({
            wrong: FieldValue.increment(1),
        });
    }


    public async registerPlayer(member: GuildMember) {
        if (await this.isRegistered(member.id)) {
            throw new Error("Player is already registered!");
        }

        return this.playerRefs.doc(member.id).create(Player.getEmptyData());
    }

    /**
     * Checks if a player is already registered in the database.
     * @param playerId The id of the player to check
     */
    public async isRegistered(playerId: string) {
        const snap = await this.playerRefs.doc(playerId).get();
        return snap.exists;
    }
}
