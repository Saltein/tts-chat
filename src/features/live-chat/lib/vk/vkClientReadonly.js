// vkClientReadonly.js
export function connectVKPlayChatReadonly(channelId) {
    if (!channelId) {
        console.error("❌ Нет channelId для подключения к VK Play Live");
        return null;
    }

    // В браузере нельзя передавать headers, только протоколы (не нужен здесь)
    const ws = new WebSocket(`wss://pubsub.live.vkvideo.ru/connection/websocket?cf_protocol_version=v2`);

    ws.onopen = () => {
        console.log(`✅ Подключено к VK Play Live (#${channelId})`);
        
        // подписка на чат readonly
        ws.send(JSON.stringify({
            id: 1,
            subscribe: { channel: `channel-chat:${channelId}` }
        }));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.push?.channel === `channel-chat:${channelId}`) {
            const msg = data.push.pub.data;
            console.log("Сообщение VK Play:", msg);
        }
    };

    ws.onclose = () => {
        console.warn("⚠️ Отключено от VK Play Live");
    };

    ws.onerror = (err) => {
        console.error("VK WS ошибка:", err);
    };

    return ws;
}
