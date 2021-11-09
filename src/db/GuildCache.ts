import { Client, Collection, Guild, GuildMember } from "discord.js";
import TriviaService from "../services/TriviaService";
import Player from "../models/Player";
import { firestore } from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;

export default class GuildCache {
    public readonly bot: Client;
    public readonly guild: Guild;
    public readonly players: Collection<string, Player>;
    public readonly playerRefs: CollectionReference<DocumentData>;
    public readonly service: TriviaService;

    public constructor(bot: Client, guild: Guild, playerRefs: CollectionReference<DocumentData>) {
        this.bot = bot;
        this.guild = guild;
        this.players = new Collection<string, Player>();
        this.playerRefs = playerRefs;
        this.service = new TriviaService();

        this.cachePlayersFromDb();
    }

    private cachePlayersFromDb() {
        this.playerRefs.get().then(snap => {
            snap.forEach(doc => {
                const member = this.guild.members.cache.get(doc.id);

                if (member) {
                    this.players.set(doc.id, new Player(member, {
                        level: doc.get("level") ?? -1,
                        xp: doc.get("xp") ?? -1,
                        correct: doc.get("correct") ?? -1,
                        wrong: doc.get("wrong") ?? -1,
                    }));
                }
            });
        });
    }

    /**
     * This method will always return a player, as they are derived from guild members.
     * @param member
     */
    public async getPlayer(member: GuildMember) {
        let player = this.players.get(member.id);

        if (!player) {
            player = await this.registerPlayer(member);
        }

        return player!;
    }

    public async registerPlayer(member: GuildMember) {
        const snap = await this.playerRefs.doc(member.id).get();

        if (!snap.exists) {
            await this.playerRefs
                .doc(member.id)
                .create(Player.getEmptyData() as DocumentData);

            const player = new Player(member, Player.getEmptyData());
            this.players.set(player.member.id, player);
            return player;
        }
    }
}
