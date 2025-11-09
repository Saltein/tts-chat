import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './app/App'
import { ThemeProvider } from './shared/context/theme/ThemeContext'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  // </React.StrictMode>
)
