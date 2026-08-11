import React from 'react'
import Home from './pages/Home'
import useGetCurrUser from './hooks/useGetCurrUser'

function App() {
  useGetCurrUser()
  return (
    <>
      <Home/>
    </>
  )
}

export default App