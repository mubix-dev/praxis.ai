import React from 'react'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import Landing from './pages/Landing'
import useGetCurrUser from './hooks/useGetCurrUser'
import useGetAllConversations from './hooks/useGetAllConversations'

function App() {
  useGetCurrUser()
  useGetAllConversations()
  const { userData } = useSelector(state => state.user)
  return (
    <>
      {userData ? <Home/> : <Landing/>}
    </>
  )
}

export default App