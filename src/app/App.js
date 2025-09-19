import { useLocation } from 'react-router-dom'
import { GlobalPage } from '../pages/GlobalPage/GlobalPage'
import s from './App.module.scss'
import { ChatWidget } from '../pages/Widgets/ChatWidget/ChatWidget'

function App() {
  const location = useLocation()
  const isWidgetRoute = location.pathname.startsWith('/widget')

  if (isWidgetRoute) {
    return <ChatWidget />
  }

  return (
    <div className={s.App}>
      <GlobalPage />
    </div>
  )
}

export default App
