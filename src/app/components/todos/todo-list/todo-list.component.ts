// src/app/components/todos/todo-list/todo-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../models/todo';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoFormComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  selectedTodo: Todo | null = null;
  showForm = false;
  loading = false;
  error = '';

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load todos';
        this.loading = false;
      }
    });
  }

  onAddNewClick() {
    this.selectedTodo = null;
    this.showForm = true;
  }

  onEdit(todo: Todo) {
    this.selectedTodo = { ...todo };
    this.showForm = true;
  }

  onCancel() {
    this.showForm = false;
    this.selectedTodo = null;
  }

  onTodoAdded(todo: Todo) {
    this.todoService.createTodo(todo).subscribe({
      next: (newTodo) => {
        this.todos = [newTodo, ...this.todos];
        this.showForm = false;
      },
      error: (error) => {
        this.error = 'Failed to create todo';
      }
    });
  }

  onTodoUpdated(todo: Todo) {
    if (!todo._id) return;
    
    this.todoService.updateTodo(todo._id, todo).subscribe({
      next: (updatedTodo) => {
        this.todos = this.todos.map(t => 
          t._id === updatedTodo._id ? updatedTodo : t
        );
        this.showForm = false;
        this.selectedTodo = null;
      },
      error: (error) => {
        this.error = 'Failed to update todo';
      }
    });
  }

  onToggleComplete(todo: Todo) {
    if (!todo._id) return;

    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(todo._id, updatedTodo).subscribe({
      next: (result) => {
        this.todos = this.todos.map(t => 
          t._id === result._id ? result : t
        );
      },
      error: (error) => {
        this.error = 'Failed to update todo';
      }
    });
  }

  onDelete(todoId: string) {
    this.todoService.deleteTodo(todoId).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t._id !== todoId);
      },
      error: (error) => {
        this.error = 'Failed to delete todo';
      }
    });
  }
}