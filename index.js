import "dotenv/config";
import * as sdk from "matrix-js-sdk";
import { RoomMemberEvent, RoomEvent } from "matrix-js-sdk";
import { startServer } from "./server.js";

const { homeserver, user_id, user_password } = process.env;

//need to join all whatsapp chats that start
const start = async () => {
  const client = sdk.createClient({ baseUrl: `https://matrix.${homeserver}` });

  await client.loginWithPassword(user_id, user_password);

  await client.startClient({ initialSyncLimit: 10 });

  client.once("sync", async (state, prevState, res) => {
    // state will be 'PREPARED' when the client is ready to use
    console.log(state);
  });

  client.on(RoomMemberEvent.Membership, function (event, member) {
    if (
      member.membership === "invite" &&
      member.userId === `@${user_id}:${homeserver}`
    ) {
      client.joinRoom(member.roomId).then(function () {
        console.log("Auto-joined %s", member.roomId);
      });
    }
  });

  const scriptStart = Date.now();

  client.on(RoomEvent.Timeline, function (event, room, toStartOfTimeline) {
    console.log(event.getType());

    const roomId = event.event.room_id;

    const eventTime = event.event.origin_server_ts;

    if (scriptStart > eventTime) {
      return; //don't run commands for old messages
    }

    if (event.getType() !== "m.room.message") {
      return; // only use messages
    }

    if (event.event.sender === `@${user_id}:${homeserver}`) return; //don't reply to your own messages

    console.log("a linked room spaketh");

    const reply = (text) => {
      client.sendTyping(roomId, true, 2000);
      setTimeout(() => client.sendTextMessage(roomId, text), 2000);
    };

    const message = event.event.content.body.toLowerCase();

    if (!message.includes("darren")) return;

    if (message.includes("hi ") || message.includes("hello ")) {
      reply("Hi, nice to meet you");
      return;
    }

    if (message.includes("how ")) {
      reply("I'm fine, can't complain");
      return;
    }

    if (message.includes("what ")) {
      reply("I make graphs");
      return;
    }

    //default reply
    reply("I guess that's just how it is");

    if (event.event.content.url) {
      console.log(event.event.content.url);

      const url = client.mxcUrlToHttp(event.event.content.url, 100, 100);

      console.log(url);
    }
  });
};

start();
startServer();
