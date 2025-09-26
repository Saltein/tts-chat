// vkClientSingleton.js
import { connectVkPlayChat } from './vkClient';

let client = null;
let currentOptions = null;
let connectionCallbacks = null;

export function getVkPlayClient() {
    return client;
}

export function connectVkPlayClient(options, callbacks = {}) {
    // Проверяем, нужно ли переподключаться
    const needsReconnect = !client ||
        currentOptions?.channelId !== options.channelId ||
        currentOptions?.token !== options.token;

    if (!client || needsReconnect) {
        // Закрываем предыдущее подключение если оно есть
        if (client) {
            client.closeConnection(); // Используем наш метод вместо close()
            client = null;
            currentOptions = null;
            connectionCallbacks = null;
        }

        // Создаем новое подключение
        client = connectVkPlayChat(options);
        currentOptions = options;
        connectionCallbacks = callbacks;

        // Настраиваем колбэки
        if (callbacks.onChatMessage) {
            client.onChatMessage = callbacks.onChatMessage;
        }
        if (callbacks.onConnected) {
            client.onConnected = callbacks.onConnected;
        }
        if (callbacks.onDisconnected) {
            client.onDisconnected = callbacks.onDisconnected;
        }
    }

    return client;
}

export function disconnectVkPlayClient() {
    if (client) {
        client.closeConnection(); // Используем наш метод для корректного закрытия
        client = null;
        currentOptions = null;
        connectionCallbacks = null;
    }
}

export function isVkPlayClientConnected() {
    return client && client.readyState === WebSocket.OPEN;
}

// Добавляем функцию для переподключения
export function reconnectVkPlayClient() {
    if (client && currentOptions) {
        const options = { ...currentOptions };
        const callbacks = { ...connectionCallbacks };
        disconnectVkPlayClient();
        return connectVkPlayClient(options, callbacks);
    }
    return null;
}