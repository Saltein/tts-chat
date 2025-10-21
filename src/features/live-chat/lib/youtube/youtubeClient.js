/**
 * Client for connecting to YouTube Live Chat via YouTube Data API v3
 * Note: YouTube API uses polling rather than WebSocket connections.
 */

const googleApiKeys = process.env.REACT_APP_GOOGLE_API_KEYS.split(' ');
let googleApiID = 0;

function getCurrentKey() {
    return googleApiKeys[googleApiID];
}

function rotateKey() {
    googleApiID++;
    if (googleApiID >= googleApiKeys.length) {
        throw new Error("❌ Все Google API ключи исчерпаны");
    }
}

export function connectYouTubeChat({ accessToken, liveChatId }, callbacks = {}) {

    if (!accessToken || !liveChatId) {
        console.error("❌ Отсутствуют обязательные параметры: accessToken и liveChatId");
        if (callbacks.onDisconnected) {
            callbacks.onDisconnected();
        }
        return null;
    }

    const client = {
        isConnected: true,
        hasConnected: false,
        nextPageToken: null,
        pollInterval: null,
        messageListeners: [],
        connectionListeners: [],
        disconnectListeners: []
    };

    // Добавляем колбэки если они предоставлены
    if (callbacks.onChatMessage) {
        client.messageListeners.push(callbacks.onChatMessage);
    }
    if (callbacks.onConnected) {
        client.connectionListeners.push(callbacks.onConnected);
    }
    if (callbacks.onDisconnected) {
        client.disconnectListeners.push(callbacks.onDisconnected);
    }

    const authParams = `access_token=${accessToken}`;

    /**
     * Poll for new messages from YouTube Live Chat
     */
    const pollMessages = async () => {
        if (!client.isConnected) return;

        try {
            const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?key=${getCurrentKey()}&liveChatId=${liveChatId}&part=id,snippet,authorDetails${client.nextPageToken ? `&pageToken=${client.nextPageToken}` : ''}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error("❌ YouTube API Error:", data.error);
                if (data.error.code === 403) {
                    try {
                        rotateKey();
                        console.warn("🔄 Переключился на следующий API ключ:", getCurrentKey());
                        // сразу пробуем снова с новым ключом
                        pollMessages();
                    } catch {
                        client.disconnect();
                    }
                    return;
                }
                return;
            }


            // Update next page token for subsequent requests
            client.nextPageToken = data.nextPageToken;

            // Если это первое успешное подключение - вызываем колбэк connected
            if (!client.hasConnected) {
                client.hasConnected = true;
                console.log("✅ YouTube Live Chat подключен");
                client.connectionListeners.forEach(listener => {
                    try {
                        listener();
                    } catch (error) {
                        console.error("❌ Ошибка в onConnected колбэке:", error);
                    }
                });
            }

            // Process messages
            if (data.items && data.items.length > 0) {
                data.items.forEach(message => {
                    // Notify all message listeners
                    client.messageListeners.forEach(listener => {
                        try {
                            listener({
                                message: message.snippet.displayMessage,
                                tags: {
                                    'display-name': message.authorDetails.displayName,
                                    'color': message.authorDetails.profileImageUrl ? '#FFFFFF' : '#CCCCCC',
                                    'is-verified': message.authorDetails.isVerified,
                                    'is-owner': message.authorDetails.isChatOwner,
                                    'is-moderator': message.authorDetails.isChatModerator,
                                    'is-sponsor': message.authorDetails.isChatSponsor
                                },
                                raw: message
                            });
                        } catch (error) {
                            console.error("❌ Ошибка в onChatMessage колбэке:", error);
                        }
                    });
                });
            }

            // Calculate next poll time (YouTube recommends following the poll delay)
            const pollDelay = data.pollingIntervalMillis || process.env.REACT_APP_GOOGLE_TIMEOUT;

            // Schedule next poll
            client.pollInterval = setTimeout(pollMessages, pollDelay);

        } catch (error) {
            console.error("❌ Error polling YouTube messages:", error);
            // Retry after error with fallback delay
            client.pollInterval = setTimeout(pollMessages, process.env.REACT_APP_GOOGLE_TIMEOUT);
        }
    };

    /**
     * Start polling for messages
     */
    client.startPolling = () => {
        console.log(`✅ Starting YouTube Live Chat polling for chat: ${liveChatId}`);
        pollMessages();
    };

    /**
     * Disconnect from YouTube Live Chat
     */
    client.disconnect = () => {
        console.log("🔌 Disconnecting from YouTube Live Chat");
        client.isConnected = false;

        if (client.pollInterval) {
            clearTimeout(client.pollInterval);
            client.pollInterval = null;
        }

        // Notify disconnect listeners
        client.disconnectListeners.forEach(listener => {
            try {
                listener();
            } catch (error) {
                console.error("❌ Ошибка в onDisconnected колбэке:", error);
            }
        });

        // Clear all listeners
        client.messageListeners = [];
        client.connectionListeners = [];
        client.disconnectListeners = [];
    };

    /**
     * Add event listeners
     */
    client.onMessage = (callback) => {
        client.messageListeners.push(callback);
    };

    client.onConnected = (callback) => {
        client.connectionListeners.push(callback);
    };

    client.onDisconnected = (callback) => {
        client.disconnectListeners.push(callback);
    };

    /**
     * Send a message to YouTube Live Chat (requires OAuth token with appropriate scope)
     */
    client.sendMessage = async (messageText) => {
        if (!accessToken) {
            console.error("❌ OAuth access token required to send messages");
            return false;
        }

        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    snippet: {
                        liveChatId: liveChatId,
                        type: 'textMessageEvent',
                        textMessageDetails: {
                            messageText: messageText
                        }
                    }
                })
            });

            const result = await response.json();
            if (result.error) {
                console.error("❌ Failed to send message:", result.error);
                return false;
            }

            console.log("✅ Message sent to YouTube Live Chat");
            return true;

        } catch (error) {
            console.error("❌ Error sending message:", error);
            return false;
        }
    };

    // Start polling automatically when connected
    client.startPolling();

    return client;
}

/**
 * Utility function to get liveChatId from video ID
 */
export async function getLiveChatIdFromVideo({ videoId }) {
    if (!videoId) {
        console.error("❌ Missing videoId");
        return null;
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${getCurrentKey()}&part=liveStreamingDetails&id=${videoId}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ YouTube API Error:", data.error);
            if (data.error.code === 403) {
                try {
                    rotateKey();
                    console.warn("🔄 Переключился на следующий API ключ:", getCurrentKey());
                    // пробуем ещё раз
                    return await getLiveChatIdFromVideo({ videoId });
                } catch {
                    return null;
                }
            }
            return null;
        }

        if (data.items && data.items.length > 0) {
            const liveChatId = data.items[0].liveStreamingDetails.activeLiveChatId;
            if (liveChatId) {
                console.log(`✅ Found liveChatId: ${liveChatId}`);
                return liveChatId;
            }
        }

        console.error("❌ No active live chat found for this video", videoId);
        return null;

    } catch (error) {
        console.error("❌ Error getting liveChatId:", error);
        return null;
    }
}
