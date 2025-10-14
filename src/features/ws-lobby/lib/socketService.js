// socketService.js
let socket = null;
let listeners = new Set();

export const connectSocket = (url = 'ws://localhost:6789') => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(url);

        socket.onopen = () => console.log('✅ WebSocket подключен');
        socket.onclose = () => console.log('❌ WebSocket закрыт');
        socket.onerror = (err) => console.error('⚠️ WebSocket ошибка:', err);

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                listeners.forEach((cb) => cb(data));
            } catch (e) {
                console.error('Ошибка парсинга:', e);
            }
        };
    }

    return socket;
};

// Добавить слушателя сообщений
export const subscribe = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

// Отправить данные
export const sendSocket = (data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    } else {
        console.warn('⚠️ Попытка отправить при неактивном соединении');
    }
};

// Получить текущий экземпляр сокета
export const getSocket = () => socket;