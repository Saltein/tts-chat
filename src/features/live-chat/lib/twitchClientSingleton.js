// twitchClientSingleton.js
import { connectTwitchChat } from './twitchClient'
let client = null;

export function getTwitchClient() {
    return client;
}

export function connectTwitchClient(options) {
    if (!client) {
        client = connectTwitchChat(options);
    }
    return client;
}

export function disconnectTwitchClient() {
    if (client) {
        client.disconnect();
        client = null;
    }
}