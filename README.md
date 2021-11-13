# ts-discord-bittrivia
A Discord bot that gets a random question and awaits an answer.

## Info
A fun little bot that I made in my free time to improve my knowledge with built-in Discord interactions e.g slash commands, buttons.

Grab a question with `/question`:

Then, choose the correct answer based on the corresponding buttons within 15 seconds. Or get it wrong.

If you've registered for a profile, you gain XP per question answered correctly.

View another player's profile! (if already registered)

View the leaderboard for the guild! (WIP)

Guilds are stored in Firestore, where each one contains a list of (registered) players. Players' progress does not apply across guilds.
All questions are grabbed from the [Open Trivia Database API].

## Libraries
- [Open Trivia Database API]
- [`discord.js`]
- [`ts-node`]
- [`axios`]
- [`firebase-admin`]

[Open Trivia Database API]: https://opentdb.com/api_config.php
[`discord.js`]: https://www.npmjs.com/package/discord.js
[`ts-node`]: https://www.npmjs.com/package/ts-node
[`axios`]: https://www.npmjs.com/package/axios
[`firebase-admin`]: https://www.npmjs.com/package/firebase-admin
