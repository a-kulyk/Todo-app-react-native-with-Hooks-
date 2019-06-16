import { ADD_TODO, COMPLETE_TODO, EDIT_TODO, REMOVE_TODO } from '../constants';

const addTodo = (todo, state) => {
  const updatedTodos = [...state.todos];

  updatedTodos.push(todo);

  return { todos: updatedTodos };
};

const editTodo = (todo, state) => {
  const updatedTodos = [...state.todos];
  const updatedItemIndex = updatedTodos.findIndex(item => item.id === todo.id);

  updatedTodos[updatedItemIndex] = todo;

  return { todos: updatedTodos };
};

const completeTodo = (id, state) => {
  const updatedTodos = [...state.todos];
  const updatedItemIndex = updatedTodos.findIndex(item => item.id === id);
  const updatedItem = updatedTodos[updatedItemIndex];

  updatedTodos[updatedItemIndex] = { ...updatedItem, completed: !updatedItem.completed };

  return { todos: updatedTodos };
};

const removeTodo = (id, state) => {
  const updatedTodos = [...state.todos];
  const updatedItemIndex = updatedTodos.findIndex(item => item.id === id);

  updatedTodos.splice(updatedItemIndex, 1);

  return { todos: updatedTodos };
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ADD_TODO:
      return addTodo(action.todo, state);
    case EDIT_TODO:
      return editTodo(action.todo, state);
    case COMPLETE_TODO:
      return completeTodo(action.id, state);
    case REMOVE_TODO:
      return removeTodo(action.id, state);
    default:
      return state;
  }
};
