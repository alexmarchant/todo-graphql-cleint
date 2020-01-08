export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

export let token: string | null = window.localStorage.getItem('token')

const apiBase = 'http://localhost:3001'
async function request<T>(query: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(apiBase + '/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: query }),
  })
  const data = await res.json()
  if (data.errors) {
    throw new Error(data.errors[0].message)
  }
  return data as Promise<T>
}

interface LoginRes {
  data: {
    login: string;
  };
}

interface SignupRes {
  data: {
    signup: string;
  };
}

interface TodosRes {
  data: {
    todos: Todo[];
  };
}

interface CreateTodoRes {
  data: {
    createTodo: Todo;
  };
}

export default {
  async login(email: string, password: string): Promise<string> {
    if (!email || !password) {
      throw new Error('Missing args')
    }
    const res = await request<LoginRes>(`
      mutation {
        login(email: "${email}", password: "${password}")
      }
    `)
    return res.data.login
  },

  async signup(name: string, email: string, password: string): Promise<string> {
    if (!name || !email || !password) {
      throw new Error('Missing args')
    }
    const res = await request<SignupRes>(`
      mutation {
        signup(name: "${name}", email: "${email}", password: "${password}")
      }
    `)
    return res.data.signup
  },

  async todos(): Promise<Todo[]> {
    const res = await request<TodosRes>(`
      {
        todos {
          id
          title
          done
        }
      }
    `)
    return res.data.todos
  },

  async createTodo(title: string): Promise<Todo> {
    if (!title) {
      throw new Error('Missing args')
    }
    const res = await request<CreateTodoRes>(`
      mutation {
        createTodo(title: "${title}") {
          id
          title
          done
        }
      }
    `)
    return res.data.createTodo
  },

  async deleteTodo(id: number): Promise<void> {
    await request(`mutation { deleteTodo(id: ${id}) }`)
  },

  async updateTodo(todo: Todo): Promise<void> {
    await request(`
      mutation {
        updateTodo(id: ${todo.id}, title: "${todo.title}", done: ${todo.done})
      }
    `)
  },
}

export function setAPIToken(newToken: string | null): void {
  token = newToken
  if (newToken) {
    window.localStorage.setItem('token', newToken)
  } else {
    window.localStorage.removeItem('token')
  }
}