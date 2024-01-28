"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const sdk = __importStar(require("matrix-js-sdk"));
const matrix_js_sdk_1 = require("matrix-js-sdk");
const server_js_1 = require("./server.js");
const { homeserver, user_id, user_password } = process.env;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = sdk.createClient({ baseUrl: `https://matrix.${homeserver}` });
    yield client.loginWithPassword(user_id, user_password);
    yield client.startClient({ initialSyncLimit: 10 });
    client.once(matrix_js_sdk_1.ClientEvent.Sync, (state, prevState, res) => __awaiter(void 0, void 0, void 0, function* () {
        // state will be 'PREPARED' when the client is ready to use
        console.log(state);
    }));
    client.on(matrix_js_sdk_1.RoomMemberEvent.Membership, function (event, member) {
        if (member.membership === "invite" &&
            member.userId === `@${user_id}:${homeserver}`) {
            client.joinRoom(member.roomId).then(function () {
                console.log("Auto-joined %s", member.roomId);
            });
        }
    });
    const scriptStart = Date.now();
    client.on(matrix_js_sdk_1.RoomEvent.Timeline, function (event, room, toStartOfTimeline) {
        console.log(event.getType());
        const roomId = event.event.room_id;
        const eventTime = event.event.origin_server_ts;
        if (scriptStart > eventTime) {
            return; //don't run commands for old messages
        }
        if (event.getType() !== "m.room.message") {
            return; // only use messages
        }
        if (event.event.sender === `@${user_id}:${homeserver}`)
            return; //don't reply to your own messages
        console.log("a linked room spaketh");
        const reply = (text) => {
            client.sendTyping(roomId, true, 2000);
            setTimeout(() => client.sendTextMessage(roomId, text), 2000);
        };
        const message = event.event.content.body.toLowerCase();
        if (!message.includes("darren"))
            return;
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
});
start();
(0, server_js_1.startServer)();
