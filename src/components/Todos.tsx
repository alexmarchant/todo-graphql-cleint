import React, { useState, useEffect, FormEvent } from 'react'
import api from '../api'

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

const Todos = (): JSX.Element => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')

  async function getTodos(): Promise<void> {
    const todos = await api.todos()
    setTodos(todos)
  }

  useEffect(() => {
    getTodos()
  }, [])

  async function submit(): Promise<void> {
    setTitle('')
    await api.createTodo(title)
    await getTodos()
  }

  async function deleteTodo(id: number): Promise<void> {
    await api.deleteTodo(id)
    await getTodos()
  }

  async function toggleTodoDone(todo: Todo): Promise<void> {
    const newTodo = JSON.parse(JSON.stringify(todo))
    newTodo.done = !newTodo.done
    await api.updateTodo(newTodo)
    await getTodos()
  }

  return (
    <div>
      <ol>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title}
            &nbsp;
            <input type="checkbox" checked={todo.done} onChange={(): void => { toggleTodoDone(todo) }} />
            <button onClick={(): void => { deleteTodo(todo.id) }}>x</button>
          </li>
        ))}
      </ol>
      <input type="text" value={title} onChange={(e: FormEvent<HTMLInputElement>): void => setTitle(e.currentTarget.value)} />
      <button onClick={submit}>Submit</button>
    </div>
  )
}

export default Todos