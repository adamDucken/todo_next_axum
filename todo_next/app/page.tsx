// app/layout.tsx or app/page.tsx
import { TodosProvider } from '@/contexts/TodosContext'
import NewTodoForm from '@/components/TodoForm'
import TodoList from '@/components/TodoList'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from 'react'

export default function TodoApp() {
  return (
    <TodosProvider>
      <main className="container mx-auto p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Todo App</CardTitle>
          </CardHeader>
          <CardContent>
            <NewTodoForm />
            <Suspense fallback={<div>Loading todos...</div>}>
              <TodoList />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </TodosProvider>
  )
}
