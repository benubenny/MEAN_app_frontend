// src/app/components/todos/todo-list/todo-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../models/todo';

@Component({
    selector: 'app-todo-list',
    standalone: true,
    imports: [CommonModule, TodoFormComponent],
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
    todos: Todo[] = [];
    loading: boolean = true;
    error: string = '';
    showForm: boolean = false;
    selectedTodo: Todo | null = null;

    constructor(private todoService: TodoService) { }

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

    onToggleComplete(todo: Todo) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        this.todoService.updateTodo(todo._id!, updatedTodo).subscribe({
            next: (updated) => {
                this.todos = this.todos.map(t => t._id === updated._id ? updated : t);
            },
            error: (error) => {
                this.error = 'Failed to update todo';
            }
        });
    }

    onDelete(todoId: string) {
        if (confirm('Are you sure you want to delete this todo?')) {
            this.todoService.deleteTodo(todoId).subscribe({
                next: () => {
                    this.todos = this.todos.filter(todo => todo._id !== todoId);
                },
                error: (error) => {
                    this.error = 'Failed to delete todo';
                }
            });
        }
    }

    onEdit(todo: Todo) {
        this.selectedTodo = { ...todo };
        this.showForm = true;
    }

    onTodoAdded(todo: Todo) {
        this.todos.unshift(todo);
        this.showForm = false;
    }

    onTodoUpdated(todo: Todo) {
        this.todos = this.todos.map(t =>
            t._id === todo._id ? todo : t
        );
        this.showForm = false;
        this.selectedTodo = null;
    }
}