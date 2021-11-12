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

    /**
     * This method will always return a player, as they are derived from guild members.
     */
    public async getPlayerData(id: string) {
        const snap = await this.playerRefs
            .doc(id)
            .get();

        if (!snap.exists) {
            return undefined;
        }

        return snap.data() as PlayerData;
    }

    public async awardXp(playerId: string) {
        await this.playerRefs
            .doc(playerId)
            .update({
                xp: FieldValue.increment(XpHelper.questionXp),
            });
    }

    public async registerPlayer(member: GuildMember) {
        const snap = await this.playerRefs.doc(member.id).get();

        if (!snap.exists) {
            await this.playerRefs
                .doc(member.id)
                .create(Player.getEmptyData() as DocumentData);
        }
        else {
            throw new Error(`${member.id} already registered`);
        }
    }
}
