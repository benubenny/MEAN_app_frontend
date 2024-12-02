// src/app/models/todo.ts
export interface Todo {
    _id?: string;
    title: string;
    description?: string;
    completed: boolean;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }