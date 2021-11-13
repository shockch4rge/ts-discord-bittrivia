import { Client, Guild, GuildMember } from "discord.js";
import TriviaService from "../services/TriviaService";
import Player, { PlayerData } from "../models/Player";
import { firestore } from "firebase-admin";
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

    public getPlayerData(id: string): Promise<PlayerData> {
        return new Promise((resolve, reject) => {
            if (this.isRegistered(id)) {
                this.playerRefs
                    .doc(id)
                    .get()
                    .then(snap => {
                        resolve(snap.data() as PlayerData);
                    });
            }
            // player already in db
            else {
                reject();
            }
        });
    }

    public async incrementStats(playerId: string) {
        const playerRef = this.playerRefs.doc(playerId);

        const xp = (await playerRef.get()).get("xp");
        const { level } = XpHelper.getLevelFromXp(xp);

        await playerRef.update({
            level: level,
            xp: FieldValue.increment(XpHelper.baseXp),
            correct: FieldValue.increment(1),
        });
    }

    public async decrementStats(playerId: string) {
        const playerRef = this.playerRefs.doc(playerId);

        await playerRef.update({
            wrong: FieldValue.increment(1),
        });
    }


    public registerPlayer(member: GuildMember): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.isRegistered(member.id)) {
                resolve(void this.playerRefs
                    .doc(member.id)
                    .create(Player.getEmptyData() as DocumentData));
            }
            // player already in db
            else {
                reject();
            }
        });
    }

    /**
     * Checks if a player is already registered in the database.
     * @param playerId The id of the player to check
     */
    public isRegistered(playerId: string) {
        let registered = false;

        this.playerRefs
            .doc(playerId)
            .get()
            .then(snap => {
                registered = snap.exists;
            });

        return registered;
    }
}
