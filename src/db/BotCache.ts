import { Client, Collection, Guild } from "discord.js";
import admin, { firestore } from "firebase-admin";

import auth from "../../auth.json";
import GuildCache from "./GuildCache";

import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;

export default class BotCache {
    private readonly db: FirebaseFirestore.Firestore;
    public readonly bot: Client;
    public readonly guildCaches: Collection<string, GuildCache>;
    public readonly guildRefs: CollectionReference<DocumentData>;

    public constructor(bot: Client) {
        admin.initializeApp({
            credential: admin.credential.cert({
                clientEmail: auth.firebase.client_email,
                privateKey: auth.firebase.private_key,
                projectId: auth.firebase.project_id,
            }),
        });
        this.db = admin.firestore();

        this.bot = bot;
        this.guildCaches = new Collection<string, GuildCache>();
        this.guildRefs = this.db.collection("guilds");
    }

    public async getGuildCache(guild: Guild) {
        let cache = this.guildCaches.get(guild.id);

        if (!cache) {
            cache = await this.createGuildCache(guild);
        }

        return cache;
    }

    public async createGuildCache(guild: Guild) {
        const guildRef = this.guildRefs.doc(guild.id);
        const snap = await guildRef.get();

        if (!snap.exists) {
            // create the guild doc and init "players" collection
            await guildRef
                .create({});
            await guildRef
                .collection("players")
                .add({});
        }

        const playerRefs = guildRef.collection("players");
        const cache = new GuildCache(this.bot, guild, playerRefs);
        this.guildCaches.set(guild.id, cache);
        return cache;
    }

    public async deleteGuildCache(guildId: string) {
        const doc = await this.guildRefs.doc(guildId).get();
        if (doc.exists) {
            await this.guildRefs.doc(guildId).delete();
        }
        this.guildCaches.delete(guildId);

    }

}
