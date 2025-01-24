import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const existingTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      if (!existingTodo) {
        state.todos.push(action.payload);
      }
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    updateTodo: (state, action) => {
      const { id, title, description, status } = action.payload; // Destructure the payload
      const todo = state.todos.find((todo) => todo.id === id); // Find the todo by ID
      if (todo) {
        // Update the todo properties if they exist in the payload
        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (status !== undefined) todo.status = status;
      }
    },
  },
});

export const { addTodo, deleteTodo, updateTodo } = todoSlice.actions;
export default todoSlice.reducer;
