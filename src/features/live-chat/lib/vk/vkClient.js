// vkClient.js
const colors = ['#D66E34', '#B8AAFF', '#1D90FF', '#9961F9', '#59A840', '#E73629', '#DE6489', '#20BBA1', '#F8B301', '#0099BB', '#7BBEFF', '#E542FF', '#A36C59', '#8BA259', '#00A9FF', '#A20BFF']

export function connectVkPlayChat({ channelId, token }) {
    if (!channelId || !token) {
        console.error("❌ Не хватает данных для подключения: channelId или token");
        return null;
    }


    // было так 
//  const ws = new WebSocket('wss://pubsub.live.vkvideo.ru/connection/websocket?cf_protocol_version=v2');
    const ws = new WebSocket('wss://ttschat.ru/vkws');

    let isAuthenticated = false;
    let lastPingTime = null;

    ws.onopen = () => {
        console.log(`✅ WebSocket подключен к VK Play Live`);

        ws.send(JSON.stringify({
            connect: {
                token: token,
                name: "js"
            },
            id: 1
        }));
    };

    ws.onmessage = (event) => {
        try {
            const data = event.data;

            // Обрабатываем разные форматы ping-сообщений
            if (data === '{}' || data === '{"ping":true}' || data === 'ping') {
                console.log("🏓 Получен ping от сервера, отправляю pong...");
                // Отправляем pong в ответ на любой формат ping
                ws.send(JSON.stringify({ pong: true }));
                return;
            }

            // Пробуем распарсить JSON
            const msg = JSON.parse(data);
            // console.log("📨 Получено сообщение:", msg);

            // Обрабатываем ping в формате JSON
            if (msg.ping !== undefined) {
                console.log("🏓 Получен ping (JSON), отправляю pong...");
                ws.send(JSON.stringify({ pong: msg.ping }));
                return;
            }

            // Обрабатываем ответ на аутентификацию
            if (msg.id === 1 && msg.connect) {
                if (msg.connect.client) {
                    console.log("✅ Аутентификация успешна");
                    isAuthenticated = true;

                    const chatChannel = `channel-chat:${channelId}`;

                    ws.send(JSON.stringify({
                        subscribe: { channel: chatChannel },
                        id: 2
                    }));

                    ws.send(JSON.stringify({
                        subscribe: { channel: `channel-info:${channelId}` },
                        id: 3
                    }));
                }
            }

            // Обрабатываем ответ на подписку
            if (msg.id === 2 && msg.subscribe !== undefined) {
                console.log("✅ Подписка на чат успешна");
                ws.onConnected && ws.onConnected();
            }

            if (msg.id === 3 && msg.subscribe !== undefined) {
                console.log("✅ Подписка на информацию о канале успешна");
            }

            console.log(msg)

            // Обрабатываем входящие сообщения чата
            if (msg.push?.channel?.startsWith('channel-chat')) {
                const chatMsg = msg.push.pub.data.data;
                const user = chatMsg.author?.displayName || 'Unknown';
                const text = JSON.parse(chatMsg.data[0].content)[0] || '';

                console.log(`💬 VK Play сообщение: [${user}]: ${text}`);
                ws.onChatMessage && ws.onChatMessage({
                    message: text,
                    tags: {
                        'display-name': user,
                        'color': colors[chatMsg.user.nickColor]
                    },
                    raw: msg 
                });
            }

            // // Обрабатываем информацию о канале
            // if (msg.push?.channel?.startsWith('channel-info')) {
            //     console.log("📊 Информация о канале:", msg.push.pub.data);
            // }

        } catch (e) {
            console.warn("❌ Ошибка парсинга VK Play сообщения:", e, "Data:", event.data);

            // Если не удалось распарсить, возможно это ping в текстовом формате
            if (event.data && event.data.includes('ping')) {
                console.log("🏓 Получен ping (текст), отправляю pong...");
                ws.send(JSON.stringify({ pong: true }));
            }
        }
    };


    ws.onclose = (event) => {
        console.warn(`⚠️ Отключено. Code: ${event.code}, Reason: "${event.reason}"`);
        ws.onDisconnected && ws.onDisconnected();
    };

    ws.onerror = (err) => {
        console.error("❌ VK WS ошибка:", err);
    };

    // Метод для корректного закрытия
    ws.closeConnection = function () {
        this.close();
    };

    return ws;
}