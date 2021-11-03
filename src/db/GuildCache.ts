import { Client, Collection, Guild, GuildMember } from "discord.js";
import TriviaService from "../services/TriviaService";
import Player from "../models/Player";
import { firestore } from "firebase-admin";
import { Level } from "../utilities/LevelCalculator";
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
                    this.players.set(doc.id, new Player(member,{
                        level: doc.get("level"),
                        xp: doc.get("xp"),
                        correct: doc.get("questionsCorrect"),
                        wrong: doc.get("questionsWrong"),
                    }));
                }
            });
        });

        console.log(`Cached ${this.players.size} players from ${this.guild.name}`);
    }

    public findPlayer(id: string) {
        return this.players.get(id);
    }

    public registerPlayer(member: GuildMember): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const foundMember = this.guild.members.cache.get(member.id);

            if (!foundMember) {
                console.error(`Could not find member: ${member.id}`);
                reject();
                return;
            }

            this.playerRefs
                .doc(foundMember.id)
                .get()
                .then(snap => {
                    // player is already registered in the db
                    if (snap.exists) {
                        reject();
                    }
                    // register the player into the db
                    else {
                        this.playerRefs
                            .doc(foundMember.id)
                            .set({ xp: 0, level: Level.ZERO, correct: 0, wrong: 0 } as DocumentData)
                            .then(() => console.log(`${foundMember.id}`));
                        this.players.set(foundMember.id, Player.getNew(foundMember));
                        resolve();
                    }
                });
        });
    }
}
