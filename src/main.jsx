import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Noto Serif JP（400・700）をバンドルしてデプロイで確実に読み込む
import '@fontsource/noto-serif-jp/400.css'
import '@fontsource/noto-serif-jp/700.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
