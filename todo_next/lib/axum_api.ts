import { CreateTodoInput, Todo, UpdateTodoInput } from "@/types/todo_types";

//todo - have to implement better thingy for API_BASE_URL
class TodoApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(message);
    this.name = 'TodoApiError';
  }
}

//a little config
const API_BASE_URL = 'http://127.0.0.1:3000';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    throw new TodoApiError(
      `API Error: ${response.statusText}`,
      response.status,
      response.statusText,
      errorData
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// list all todos with optional error retry
export async function getTodos(retries = 3): Promise<Todo[]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      return handleResponse<Todo[]>(response);
    } catch (error) {
      lastError = error as Error;
      if (attempt === retries - 1) break;
      // Wait before retrying (with exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw lastError;
}

// create a new todo
export async function createTodo(todo: CreateTodoInput): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(todo),
  });

  return handleResponse<Todo>(response);
}

// get a single todo by ID
export async function getTodoById(id: number): Promise<Todo> {
  if (!id || id <= 0) {
    throw new Error('Invalid todo ID');
  }

  const response = await fetch(`${API_BASE_URL}/todos/${id}`);
  return handleResponse<Todo>(response);
}

// update a todo by ID
export async function updateTodo(id: number, updates: UpdateTodoInput): Promise<Todo> {
  if (!id || id <= 0) {
    throw new Error('Invalid todo ID');
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No updates provided');
  }

  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(updates),
  });

  return handleResponse<Todo>(response);
}

// delete a todo by ID
export async function deleteTodo(id: number): Promise<void> {
  if (!id || id <= 0) {
    throw new Error('Invalid todo ID');
  }

  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  return handleResponse<void>(response);
}
