// contexts/TodosContext.tsx
'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { getTodos } from '@/lib/todo_api'
import type { Todo } from '@/types/todo_types'
import { TodosContextType } from '@/types/todo_types'

const TodosContext = createContext<TodosContextType | null>(null)

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshTodos = useCallback(async () => {
    setIsLoading(true)
    try {
      const newTodos = await getTodos()
      setTodos(newTodos)
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <TodosContext.Provider value={{ todos, refreshTodos, isLoading }}>
      {children}
    </TodosContext.Provider>
  )
}

export function useTodos() {
  const context = useContext(TodosContext)
  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider')
  }
  return context
}
