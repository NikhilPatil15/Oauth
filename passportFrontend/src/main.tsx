import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GetUser from './GetUser.tsx'
import SetAccessToken from './SetAccessToken.tsx'
import { AuthProvider } from './AuthContext/AuthContext.tsx'
import OAuth from './OAuth.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/set-accessToken' element={<SetAccessToken/>}/>
      <Route path='/get-user' element={<GetUser/>}/>
      <Route path='/auth/google' element={<OAuth/>}/>
    </Routes>
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
