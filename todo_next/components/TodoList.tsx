// components/TodoList.tsx
'use client'

import { useEffect } from 'react'
import TodoItem from './TodoItem'
import { useTodos } from '@/contexts/TodosContext'

export default function TodoList() {
  const { todos, refreshTodos, isLoading } = useTodos()

  useEffect(() => {
    refreshTodos()
  }, [refreshTodos])

  if (isLoading) {
    return <div>Loading todos...</div>
  }

  return (
    <ul className="space-y-2 mt-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={refreshTodos}
          onDelete={refreshTodos}
        />
      ))}
    </ul>
  )
}
