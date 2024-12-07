'use client'

import { useState } from 'react'
import { updateTodo, deleteTodo } from '@/lib/axum_api'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'

export default function TodoItem({ todo }) {
  const [isCompleted, setIsCompleted] = useState(todo.completed)

  const handleToggle = async () => {
    try {
      const updatedTodo = await updateTodo(todo.id, { ...todo, completed: !isCompleted })
      setIsCompleted(updatedTodo.completed)
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id)
      // You might want to implement a way to remove this item from the list
      // For now, we'll just log the success
      console.log('Todo deleted successfully')
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  return (
    <li className="flex items-center justify-between p-2 bg-white rounded shadow">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggle}
          id={`todo-${todo.id}`}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-sm ${isCompleted ? 'line-through text-gray-500' : ''}`}
        >
          {todo.title}
        </label>
      </div>
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  )
}


