// socketService.js
import { store } from '../../../app/store'; // импорт твоего Redux стора
import { setMessages } from '../../../entities/connection/model/slice';
import { setConnectionStatus, setRoomCode, setMode } from '../model/slice';

let socket = null;
let listeners = new Set();

const WS_URL = process.env.REACT_APP_BASE_URL_WEBSOCKET

export const connectSocket = (url = WS_URL) => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('✅ WebSocket подключен');
            store.dispatch(setConnectionStatus('connected'));
        };
        socket.onclose = () => {
            console.log('❌ WebSocket закрыт');
            store.dispatch(setConnectionStatus('disconnected'));
        };
        socket.onerror = (err) => {
            console.error('⚠️ WebSocket ошибка:', err);
            store.dispatch(setConnectionStatus('error'));
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // глобальное обновление Redux
                handleGlobalMessage(data);

                // уведомляем локальные подписчики
                listeners.forEach((cb) => cb(data));
            } catch (e) {
                console.error('Ошибка парсинга:', e);
            }
        };
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log('🔌 Отключаем WebSocket');
        socket.close();
        socket = null;
    }

    listeners.clear();

    // Сброс состояния
    store.dispatch(setConnectionStatus('disconnected'));
    store.dispatch(setRoomCode(''));
    store.dispatch(setMode('select'));
};

export const leaveRoom = () => {
    const socket = getSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('🚪 Выход из комнаты');
        socket.send('leave');
    } else {
        console.warn('⚠️ Невозможно выйти — сокет не подключен');
    }

    store.dispatch(setRoomCode(''));
    store.dispatch(setMode('select'));
    store.dispatch(setConnectionStatus('connected'));
};

const handleGlobalMessage = (data) => {
    switch (data.type) {
        case 'room_created':
            store.dispatch(setRoomCode(data.code));
            store.dispatch(setMode('host'));
            break;
        case 'joined':
            store.dispatch(setRoomCode(data.code));
            store.dispatch(setMode('guest'));
            break;
        case 'data':
            store.dispatch(setMessages(data.payload));
            break;
        case 'client_connected':
        case 'client_disconnected':
            // можно добавить отдельный слайс для clientsCount
            break;
        case 'room_closed':
            store.dispatch(setConnectionStatus('disconnected'));
            break;
        case 'error':
            store.dispatch(setConnectionStatus('error'));
            break;
        default:
            console.log('Неизвестный тип:', data);
    }
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
