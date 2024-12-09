export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface CreateTodoInput {
  title: string;
  completed: boolean;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

export interface TodosContextType {
  todos: Todo[];
  refreshTodos: () => Promise<void>;
  isLoading: boolean;
}

export interface TodoItemProps {
  todo: Todo;
  onUpdate?: () => void;
  onDelete?: () => void;
}
