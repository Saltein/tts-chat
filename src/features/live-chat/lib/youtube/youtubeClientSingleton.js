// youtubeClientSingleton.js

import { connectYouTubeChat, getLiveChatIdFromVideo } from './youtubeClient';

let client = null;
let currentOptions = null;

/**
 * Singleton controller for YouTube Live Chat client
 */
export function getYouTubeClient() {
    return client;
}

export async function connectYouTubeClient(options) {
    // If we already have a client with the same options, return it
    if (client && currentOptions &&
        currentOptions.liveChatId === options.liveChatId &&
        currentOptions.accessToken === options.accessToken) {
        return client;
    }

    // Disconnect existing client if any
    if (client) {
        disconnectYouTubeClient();
    }

    // Get liveChatId from videoId if needed
    let liveChatId = options.liveChatId;
    if (!liveChatId && options.videoId) {
        liveChatId = await getLiveChatIdFromVideo({
            videoId: options.videoId
        });

        if (!liveChatId) {
            console.error("❌ Could not retrieve liveChatId from video");
            return null;
        }
    }

    if (!liveChatId) {
        console.error("❌ No liveChatId provided and no videoId to retrieve it from");
        return null;
    }

    // Create new client
    const clientOptions = {
        ...options,
        liveChatId: liveChatId
    };

    client = connectYouTubeChat(clientOptions);
    currentOptions = clientOptions;

    return client;
}

export function disconnectYouTubeClient() {
    if (client) {
        client.disconnect();
        client = null;
        currentOptions = null;
    }
}

export function isYouTubeClientConnected() {
    return client && client.isConnected;
}

/**
 * Send message through YouTube client (requires OAuth token)
 */
export function sendYouTubeMessage(messageText) {
    if (client && client.sendMessage) {
        return client.sendMessage(messageText);
    }
    console.error("❌ No YouTube client available or client doesn't support sending messages");
    return false;
}