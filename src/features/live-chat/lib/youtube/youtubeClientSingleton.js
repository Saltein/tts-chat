import { connectYouTubeChat, getLiveChatIdFromVideo } from './youtubeClient';

let client = null;
let currentOptions = null;
let currentCallbacks = null;

/**
 * Singleton controller for YouTube Live Chat client
 */
export function getYouTubeClient() {
    return client;
}

export async function connectYouTubeClient(options, callbacks = {}) {
    // Если уже есть подключенный клиент, отключаем его
    if (client) {
        disconnectYouTubeClient();
    }

    // Получаем liveChatId из videoId если нужно
    let liveChatId = options.liveChatId;
    if (!liveChatId && options.videoId) {
        liveChatId = await getLiveChatIdFromVideo({
            videoId: options.videoId
        });

        if (!liveChatId) {
            console.error("❌ Не удалось получить liveChatId из video");
            if (callbacks.onDisconnected) {
                callbacks.onDisconnected();
            }
            return null;
        }
    }

    if (!liveChatId) {
        console.error("❌ Не указан liveChatId и нет videoId для его получения");
        if (callbacks.onDisconnected) {
            callbacks.onDisconnected();
        }
        return null;
    }

    if (!options.accessToken) {
        console.error("❌ Отсутствует accessToken для YouTube");
        if (callbacks.onDisconnected) {
            callbacks.onDisconnected();
        }
        return null;
    }

    // Создаем нового клиента
    const clientOptions = {
        ...options,
        liveChatId: liveChatId
    };

    try {
        client = connectYouTubeChat(clientOptions, callbacks);
        currentOptions = clientOptions;
        currentCallbacks = callbacks;

        return client;
    } catch (error) {
        console.error("❌ Ошибка создания YouTube клиента:", error);
        if (callbacks.onDisconnected) {
            callbacks.onDisconnected();
        }
        return null;
    }
}

export function disconnectYouTubeClient() {
    if (client) {
        console.log("🔌 Отключение YouTube клиента...");
        client.disconnect();
        client = null;
        currentOptions = null;

        if (currentCallbacks && currentCallbacks.onDisconnected) {
            currentCallbacks.onDisconnected();
        }
        currentCallbacks = null;
    }
}

export function isYouTubeClientConnected() {
    return client && client.isConnected;
}

/**
 * Отправить сообщение через YouTube клиент (требуется OAuth токен)
 */
export function sendYouTubeMessage(messageText) {
    if (client && client.sendMessage) {
        return client.sendMessage(messageText);
    }
    console.error("❌ YouTube клиент недоступен или не поддерживает отправку сообщений");
    return false;
}