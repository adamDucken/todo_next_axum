import { getTodos } from '@/lib/axum_api'
import TodoItem from './TodoItem'

export default async function TodoList() {
  const todos = await getTodos()

  return (
    <ul className="space-y-2 mt-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}


