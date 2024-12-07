'use client'

import { useState } from 'react'
import { createTodo } from '@/lib/axum_api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewTodoForm() {
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await createTodo({ title, completed: false })
      setTitle('')
      // might want to implement a way to add this new todo to the list
      // now, we'll just log the success
      console.log('Todo created successfully')
    } catch (error) {
      console.error('Failed to create todo:', error)
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
      />
      <Button type="submit">Add</Button>
    </form>
  )
}


