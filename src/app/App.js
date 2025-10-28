import { useLocation } from 'react-router-dom'
import { GlobalPage } from '../pages/GlobalPage/GlobalPage'
import s from './App.module.scss'
import { ChatWidget } from '../pages/Widgets/ChatWidget/ChatWidget'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QRWidget } from '../pages/Widgets/QRWidget/QRWidget'
import TgLogo from '../shared/assets/icons/telegram-logo-filled.svg'

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

function App() {
  const location = useLocation()
  const starts = (path) => location.pathname.startsWith(path)

  const text = (
    <div>
      <h3>Подпишись</h3>
      <p>Не пропускай стримы</p>
      <h2>@SALTEIN</h2>
    </div>
  )

  if (starts('/widget')) {
    if (starts('/widget/chat')) {
      return <ChatWidget />
    }
    else if (starts('/widget/qrcode')) {
      return <QRWidget value={'https://t.me/saltein'} logoImage={TgLogo} text={text} frequency={300} showTime={30} />
    }
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className={s.App}>
        <GlobalPage />
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
