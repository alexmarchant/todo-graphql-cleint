import React, { useState } from 'react'
import Login from './components/Login'
import Todos from './components/Todos'
import { token as apiToken, setAPIToken } from './api'

const App= (): JSX.Element => {
  const [token, setToken] = useState<string | null>(apiToken)

  function logout() {
    setToken(null)
    setAPIToken(null)
  }

  let content
  if (token) {
    content = <Todos />
  } else {
    content = <Login setToken={setToken} />
  }

  return (
    <div>
      {content}
      {token && (
        <button onClick={logout}>Log Out</button>
      )}
    </div>
  )
}

export default App
