import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import { ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'



function App() {
  const [count, setCount] = useState(0)
  const theme=createTheme();
  return (
    <>
    <ThemeProvider theme={theme} >
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </ThemeProvider>
      
    </>
  )
}

export default App
