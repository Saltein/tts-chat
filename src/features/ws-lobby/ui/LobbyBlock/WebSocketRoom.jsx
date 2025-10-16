import s from './WebSocketRoom.module.scss'
import { useState, useEffect, useRef } from 'react';
import { connectSocket, subscribe, sendSocket } from '../../lib/socketService';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectConnectionStatus,
    selectInputCode,
    selectMode,
    selectRoomCode,
    setConnectionStatus,
    setInputCode,
    setMode,
    setRoomCode
} from '../../model/slice';
import { selectLast50Messages, setMessages } from '../../../../entities/connection/model/slice';
import { ChatMessage } from '../../../live-chat/ui/ChatMessage/ChatMessage';

const WebSocketRoom = ({ inWidget = false }) => {
    const timeBeforeDisappear = 10

    const [mode, setModeLocal] = useState(useSelector(selectMode));
    const [roomCode, setRoomCodeLocal] = useState(useSelector(selectRoomCode));
    const [inputCode, setInputCodeLocal] = useState(useSelector(selectInputCode));
    const [connectionStatus, setConnectionStatusLocal] = useState(useSelector(selectConnectionStatus));
    const [receivedData, setReceivedData] = useState([]);
    const [clientsCount, setClientsCount] = useState(0);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(timeBeforeDisappear)
    const [isVisible, setIsVisible] = useState(true)

    const messages = useSelector(selectLast50Messages);
    const dispatch = useDispatch();

    const modeRef = useRef(mode);
    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    // ✅ Подключаем WebSocket один раз (и он теперь глобальный)
    useEffect(() => {
        const socket = connectSocket();
        setConnectionStatus(socket.readyState === WebSocket.OPEN ? 'connected' : 'connecting');

        // подписка теперь просто для локальных логов
        const unsubscribe = subscribe((data) => {
            console.log('📩 Получено сообщение (локально):', data);
            if (data.type === 'room_created') {
                setRoomCodeLocal(data.code)
            }
            if (data.type === 'data') setReceivedData(data.payload);
            if (data.type === 'client_connected' || data.type === 'client_disconnected')
                setClientsCount(data.clients_count);
            if (data.type === 'room_closed' || data.type === 'error')
                setError(data.message || 'Комната закрыта');
        });

        if (inWidget) {
            createRoom()
        }

        return () => {
            // ❌ Не закрываем соединение
            unsubscribe();
        };
    }, []);

    const createRoom = () => {
        setError('');
        const socket = connectSocket();
        if (socket.readyState === WebSocket.OPEN) {
            sendSocket('create');
        } else {
            socket.onopen = () => sendSocket('create');
        }
    };

    const joinRoom = (code) => {
        setError('');
        const socket = connectSocket();
        if (socket.readyState === WebSocket.OPEN) {
            sendSocket(`join:${code}`);
        } else {
            socket.onopen = () => sendSocket(`join:${code}`);
        }
    };

    const sendData = (data) => {
        if (modeRef.current === 'host') {
            sendSocket(data);
        }
    };

    const sendTestData = () => {
        sendData({
            action: 'update',
            timestamp: Date.now(),
            items: [
                { id: 1, name: 'Item 1', value: Math.random() },
                { id: 2, name: 'Item 2', value: Math.random() }
            ]
        });
    };

    const sendMessagesData = () => {
        sendData(messages);
    };

    useEffect(() => {
        sendMessagesData();
    }, [messages]);

    useEffect(() => {
        let interval
        if (isVisible && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1)
            }, 1000)
        } else {
            setIsVisible(false)
            clearInterval(interval)
            console.warn('Код скрыт')
        }
        return () => clearInterval(interval)
    }, [isVisible, timer])

    if (inWidget) {
        return (
            <ChatMessage
                message={{
                    message: <span>Код комнаты <b>{roomCode}</b>, это сообщение исчезнет через <b>{timer}</b> c</span>,
                    tags: {
                        'display-name': 'TTS Chat',
                        'color': 'var(--color-accent)'
                    },
                    time: Date.now(),
                    service: 'ttschat',
                }}
                timeBeforeDisappear={timeBeforeDisappear * 1000}
            />
        )
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>WebSocket Room</h1>

            {mode === 'select' && (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <button onClick={createRoom} style={{ padding: '10px 20px', fontSize: '16px' }}>
                            Создать комнату
                        </button>
                    </div>
                    <div>
                        <input
                            type="text"
                            value={inputCode}
                            onChange={(e) => {
                                dispatch(setInputCode(e.target.value.toUpperCase()));
                                setInputCodeLocal(e.target.value.toUpperCase());
                            }}
                            placeholder="Введите код комнаты"
                            style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
                        />
                        <button
                            onClick={() => joinRoom(inputCode)}
                            disabled={!inputCode}
                            style={{ padding: '10px 20px', fontSize: '16px' }}
                        >
                            Подключиться
                        </button>
                    </div>
                </div>
            )}

            {mode === 'host' && (
                <div>
                    <p>Статус: <strong>{connectionStatus}</strong></p>
                    <p>Код комнаты: <strong>{roomCode}</strong></p>
                    <p>Клиенты: <strong>{clientsCount}</strong></p>

                    <button onClick={sendTestData} style={{ padding: '10px 20px', marginRight: '10px' }}>
                        Отправить тестовые данные
                    </button>
                </div>
            )}

            {mode === 'client' && (
                <div>
                    <p>Комната: <strong>{roomCode}</strong></p>
                    {/* <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {JSON.stringify(receivedData)}
                    </div> */}
                </div>
            )}

            {error && (
                <div style={{
                    color: 'red',
                    marginTop: '20px',
                    padding: '10px',
                    border: '1px solid red',
                    backgroundColor: '#ffe6e6'
                }}>
                    Ошибка: {error}
                </div>
            )}
        </div>
    );
};

export default WebSocketRoom;
