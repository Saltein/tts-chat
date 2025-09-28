import { useLocation } from 'react-router-dom'
import { GlobalPage } from '../pages/GlobalPage/GlobalPage'
import s from './App.module.scss'
import { ChatWidget } from '../pages/Widgets/ChatWidget/ChatWidget'
import { GoogleOAuthProvider } from '@react-oauth/google'

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

function App() {
  const location = useLocation()
  const isWidgetRoute = location.pathname.startsWith('/widget')

  if (isWidgetRoute) {
    return <ChatWidget />
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
