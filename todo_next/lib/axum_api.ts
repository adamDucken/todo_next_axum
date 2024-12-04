// todo - have to change ip part's if i implement it with docker 


// list all todos
export const getTodos = async () => {
  const response = await fetch('http://127.0.0.1:3000/todos');
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
};

// create a new todo
export const createTodo = async (todo: { title: string; completed: boolean }) => {
  const response = await fetch('http://127.0.0.1:3000/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
};

// get a single todo by ID
export const getTodoById = async (id: number) => {
  const response = await fetch(`http://127.0.0.1:3000/todos/${id}`);
  if (!response.ok) throw new Error('Failed to fetch todo');
  return response.json();
};

// update a todo by ID
export const updateTodo = async (id: number, todo: { title: string; completed: boolean }) => {
  const response = await fetch(`http://127.0.0.1:3000/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
};

// delete a todo by ID
export const deleteTodo = async (id: number) => {
  const response = await fetch(`http://127.0.0.1:3000/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete todo');
  return response.status === 204 ? null : response.json();
};


