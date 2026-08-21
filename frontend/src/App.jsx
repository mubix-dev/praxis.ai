import React from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Landing from './pages/Landing'
import PaymentResult from './pages/PaymentResult'
import useGetCurrUser from './hooks/useGetCurrUser'
import useGetAllConversations from './hooks/useGetAllConversations'
import useGetCredits from './hooks/useGetCredits'

function App() {
  useGetCurrUser()
  useGetAllConversations()
  useGetCredits()
  const { userData, userLoading } = useSelector(state => state.user)

  // loading screen while the session is being restored
  if (userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0d0f14]">
        <h2 className="text-2xl font-medium tracking-[0.35em] text-slate-100 animate-pulse">
          PR<span className="text-indigo-400">A</span>X<span className="text-cyan-400">I</span>S
        </h2>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={userData ? <Navigate to="/chat" replace /> : <Landing />} />
      <Route path="/chat" element={userData ? <Home /> : <Navigate to="/" replace />} />
      <Route path="/chat/:conversationId" element={userData ? <Home /> : <Navigate to="/" replace />} />
      <Route path="/payment/success" element={<PaymentResult success />} />
      <Route path="/payment/cancelled" element={<PaymentResult />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
