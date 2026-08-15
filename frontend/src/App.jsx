import React from 'react'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import Landing from './pages/Landing'
import useGetCurrUser from './hooks/useGetCurrUser'
import useGetAllConversations from './hooks/useGetAllConversations'

function App() {
  useGetCurrUser()
  useGetAllConversations()
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
    <>
      {userData ? <Home/> : <Landing/>}
    </>
  )
}

export default App