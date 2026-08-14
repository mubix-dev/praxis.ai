import React from 'react'
import Home from './pages/Home'
import useGetCurrUser from './hooks/useGetCurrUser'
import useGetAllConversations from './hooks/useGetAllConversations'

function App() {
  useGetCurrUser()
  useGetAllConversations()
  return (
    <>
      <Home/>
    </>
  )
}

export default App