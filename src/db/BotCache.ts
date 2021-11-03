import GuildCache from "./GuildCache";
import { Client, Collection, Guild } from "discord.js";
import admin, { firestore } from "firebase-admin";
import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;

const auth = require("../../auth.json");

export default class BotCache {
    private readonly db: FirebaseFirestore.Firestore;
    public readonly bot: Client;
    public readonly guildCaches: Collection<string, GuildCache>;
    public readonly guildRefs: CollectionReference<DocumentData>;

    public constructor(bot: Client) {
        // init db
        admin.initializeApp({ credential: admin.credential.cert(auth.firebase.service_account) });
        this.db = admin.firestore();

        this.bot = bot;
        this.guildCaches = new Collection<string, GuildCache>();
        this.guildRefs = this.db.collection("guilds");
    }

    public getGuildCache(guild: Guild): Promise<GuildCache> {
        return new Promise<GuildCache>((resolve, reject) => {
            let cache = this.guildCaches.get(guild.id);

            // guild doesn't exist locally; add it
            if (!cache) {
                const playerRefs = this.guildRefs
                    .doc(guild.id)
                    .collection("players");
                cache = new GuildCache(this.bot, guild, playerRefs);
                this.guildCaches.set(guild.id, cache);

                this.guildRefs
                    .doc(guild.id)
                    .get()
                    .then(snap => {
                        if (!snap.exists) {
                            reject();
                        }
                        else {
                            resolve(cache!);
                        }
                    });

            }
            // guild exists
            else {
                resolve(cache);
            }
        });
    }

    public async createGuildCache(guild: Guild) {
        const doc = await this.guildRefs.doc(guild.id).get();
        if (!doc.exists) {
            await this.guildRefs
                .doc(guild.id)
                .collection("members");
            console.log("Created guild")
        }
        await this.getGuildCache(guild);
    }

    public async deleteGuildCache(guildId: string) {
        const doc = await this.guildRefs.doc(guildId).get();
        if (doc.exists) {
            await this.guildRefs.doc(guildId).delete();
        }
        this.guildCaches.delete(guildId);

    }

}
