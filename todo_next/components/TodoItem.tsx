// components/TodoItem.tsx
'use client'

import { useState } from 'react'
import { updateTodo, deleteTodo } from '@/lib/todo_api'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import type { TodoItemProps } from '@/types/todo_types'

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isCompleted, setIsCompleted] = useState(todo.completed)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      await updateTodo(todo.id, { ...todo, completed: !isCompleted })
      setIsCompleted(!isCompleted)
      onUpdate?.()
    } catch (error) {
      console.error('Failed to update todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteTodo(todo.id)
      onDelete?.()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <li className="flex items-center justify-between p-2 bg-white rounded shadow">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggle}
          id={`todo-${todo.id}`}
          disabled={isLoading}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-sm ${isCompleted ? 'line-through text-gray-500' : ''}`}
        >
          {todo.title}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  )
}
