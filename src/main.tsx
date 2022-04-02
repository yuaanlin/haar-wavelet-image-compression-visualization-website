import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
