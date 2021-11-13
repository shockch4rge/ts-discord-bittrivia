# ts-discord-bittrivia
A Discord bot that gets a random question and awaits an answer.

## Info
A fun little bot that I made in my free time to improve my knowledge with built-in Discord interactions e.g slash commands, buttons.

Grab a question with `/question` (interface is still being worked on):

![8bc268f5d114a8eaa496f894be4bda74](https://user-images.githubusercontent.com/21127100/141646161-0be0cd1d-42f5-4287-b080-f29b751a2069.gif)


Then, choose the correct answer based on the corresponding buttons within 15 seconds. _Or get it wrong._

![9fa90f23d8c3076468553c83ca8c51ac](https://user-images.githubusercontent.com/21127100/141646195-8f413a9d-e3b5-4a57-a74c-437cd2534f6a.gif)


If you've registered for a profile, you gain XP per question answered correctly.

View another player's profile! (if already registered) (WIP)

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

