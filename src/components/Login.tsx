import React, { useState, Dispatch, SetStateAction, FormEvent } from 'react'
import api, { setAPIToken } from '../api'

enum Mode {
  Login,
  Signup,
}

interface Props {
  setToken: Dispatch<SetStateAction<string | null>>;
}

const Login = ({ setToken }: Props): JSX.Element => {
  const [mode, setMode] = useState(Mode.Login)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  let switchButton
  if (mode === Mode.Login) {
    switchButton = <button onClick={(): void => setMode(Mode.Signup)}>Signup</button>
  } else {
    switchButton = <button onClick={(): void => setMode(Mode.Login)}>Login</button>
  }

  async function submit(e: FormEvent): Promise<void> {
    e.preventDefault()
    console.log(name, email, password)
    let token
    if (mode === Mode.Login) {
      token = await api.login(email, password)
    } else {
      token = await api.signup(name, email, password)
    }

    setAPIToken(token)
    setToken(token)
  }

  function setValue(func: typeof setName | typeof setEmail | typeof setPassword) {
    return (e: FormEvent<HTMLInputElement>): void => {
      func(e.currentTarget.value)
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        {mode === Mode.Signup && (
          <>
            <strong>Name</strong>
            <input type="text" value={name} onChange={setValue(setName)} />
            <br></br>
          </>
        )}
        <strong>Email</strong>
        <input type="text" value={email} onChange={setValue(setEmail)}/>
        <br></br>
        <strong>Password</strong>
        <input type="text" value={password} onChange={setValue(setPassword)} />
        <br></br>
        <button onClick={submit}>Submit</button>
      </form>
      {switchButton}
    </div>
  )
}

export default Login