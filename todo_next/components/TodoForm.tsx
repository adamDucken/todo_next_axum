// components/NewTodoForm.tsx
'use client'

import { useState } from 'react'
import { createTodo } from '@/lib/todo_api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTodos } from '@/contexts/TodosContext'

export default function NewTodoForm() {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { refreshTodos } = useTodos()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      await createTodo({ title, completed: false })
      setTitle('')
      refreshTodos()
    } catch (error) {
      console.error('Failed to create todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-grow"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add'}
      </Button>
    </form>
  )
}
