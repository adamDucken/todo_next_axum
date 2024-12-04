// Types for better type safety and documentation
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


