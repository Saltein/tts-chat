import s from './WebSocketRoom.module.scss'
import { useState, useEffect, useRef } from 'react'
import { connectSocket, subscribe, sendSocket, leaveRoom } from '../../lib/socketService'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectConnectionStatus,
    selectInputCode,
    selectMode,
    selectRoomCode,
    setConnectionStatus,
    setInputCode,
    setMode,
    setRoomCode
} from '../../model/slice'
import { selectLast50Messages, setMessages } from '../../../../entities/connection/model/slice'
import { ChatMessage } from '../../../live-chat/ui/ChatMessage/ChatMessage'
import { DefaultButton, DefaultDivider, DefaultInput, DefaultTitle } from '../../../../shared/ui'
import { SimpleWidgetShape } from '../../../../shared/widgets/SimpleWidgetShape/SimpleWidgetShape'

import { ReactComponent as CopyIcon } from '../../../../shared/assets/icons/copy.svg'

const WebSocketRoom = ({ inWidget = false }) => {
    const timeBeforeDisappear = 10

    const connectionStatusRedux = useSelector(selectConnectionStatus)

    const [mode, setModeLocal] = useState(useSelector(selectMode))
    const [roomCode, setRoomCodeLocal] = useState(useSelector(selectRoomCode))
    const [inputCode, setInputCodeLocal] = useState(useSelector(selectInputCode))
    const [connectionStatus, setConnectionStatusLocal] = useState(connectionStatusRedux)
    const [receivedData, setReceivedData] = useState([])
    const [clientsCount, setClientsCount] = useState(0)
    const [error, setError] = useState('')
    const [timer, setTimer] = useState(timeBeforeDisappear)
    const [isVisible, setIsVisible] = useState(true)

    const messages = useSelector(selectLast50Messages)
    const dispatch = useDispatch()

    const modeRef = useRef(mode)
    useEffect(() => {
        modeRef.current = mode
    }, [mode])

    // ✅ Подключаем WebSocket один раз (и он теперь глобальный)
    useEffect(() => {
        const socket = connectSocket();
        setConnectionStatus(socket.readyState === WebSocket.OPEN ? 'connected' : 'connecting')

        // подписка теперь просто для локальных логов
        const unsubscribe = subscribe((data) => {
            console.log('📩 Получено сообщение (локально):', data)
            if (data.type === 'room_created') {
                setRoomCodeLocal(data.code)
            }
            if (data.type === 'data') setReceivedData(data.payload)
            if (data.type === 'client_connected' || data.type === 'client_disconnected')
                setClientsCount(data.clients_count);
            if (data.type === 'room_closed' || data.type === 'error') {
                setModeLocal('select')
                setError(data.message || 'Комната закрыта')
            }
        })

        if (inWidget) {
            createRoom()
        }

        return () => {
            // ❌ Не закрываем соединение
            unsubscribe()
        }
    }, [])

    const createRoom = () => {
        setError('')
        const socket = connectSocket()
        setModeLocal('host')
        if (socket.readyState === WebSocket.OPEN) {
            sendSocket('create')
        } else {
            socket.onopen = () => sendSocket('create')
        }
    }

    const joinRoom = (code) => {
        setError('')
        const socket = connectSocket();
        setModeLocal('guest')
        if (socket.readyState === WebSocket.OPEN) {
            sendSocket(`join:${code}`)
        } else {
            socket.onopen = () => sendSocket(`join:${code}`)
        }
    }

    const sendData = (data) => {
        if (modeRef.current === 'host') {
            sendSocket(data)
        }
    }

    const sendMessagesData = () => {
        sendData(messages)
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(roomCode)
    }

    useEffect(() => {
        sendMessagesData()
    }, [messages])

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
        setMode('host')
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
        <>
            <div className={s.wrapper}>
                <DefaultTitle title={'Общий чат-канал (beta)'} alignContent={'center'} paddingTop={'6px'} paddingBottom={'6px'} />

                {mode === 'select' &&
                    <>
                        <DefaultButton width={'256px'} height={'32px'} title={'Создать комнату'} onClick={createRoom} />
                        <DefaultDivider />
                        <DefaultInput width={'256px'} height={'32px'} placeholder={'Код комнаты'} align={'center'} value={inputCode} onChange={(e) => {
                            setError('')
                            const newValue = e.target.value.toUpperCase()
                            if (newValue.length <= 6) {
                                dispatch(setInputCode(e.target.value.toUpperCase()));
                                setInputCodeLocal(e.target.value.toUpperCase());
                            }
                        }} />
                        <DefaultButton width={'256px'} height={'32px'} title={'Подключиться'} onClick={() => joinRoom(inputCode)} active={inputCode.length === 6} />
                    </>
                }
                {(mode === 'host' || mode === 'guest') &&
                    <>
                        <SimpleWidgetShape gap={'4px'} width={'256px'}>
                            <div className={s.line}>
                                <span>Код комнаты: </span>
                                <div style={{ display: 'flex', cursor: 'pointer', gap: '4px' }} onClick={handleCopy} >
                                    <b style={{ userSelect: 'text', cursor: 'pointer' }} >{roomCode}</b>
                                    <div className={s.copyBtn}>
                                        <CopyIcon className={s.copyIcon} color='var(--color-text)' />
                                    </div>
                                </div>
                            </div>
                            <DefaultDivider />
                            <div className={s.line}>
                                <span>Роль: </span>
                                <b>{mode}</b>
                            </div>
                            {mode === 'host' &&
                                <div className={s.line}>
                                    <span>В сети: </span>
                                    <b>{clientsCount}</b>
                                </div>
                            }
                        </SimpleWidgetShape>

                        <DefaultButton title={'Отключиться'} width={'256px'} height='32px'
                            onClick={() => {
                                leaveRoom()
                                setModeLocal('select')
                                setRoomCodeLocal('')
                                setClientsCount(0)
                                setError('')
                            }} />
                    </>
                }
            </div>

            {error && (
                <div style={{
                    color: 'red',
                    marginTop: '0.75rem',
                    padding: '4px',
                    height: '32px',
                    border: '1px solid red',
                    backgroundColor: '#ffe6e6',
                    borderRadius: '8px'
                }}>
                    Ошибка: {error}
                </div>
            )}

        </>
    )
}

export default WebSocketRoom
