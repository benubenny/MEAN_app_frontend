// src/app/components/todos/todo-form/todo-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../models/todo';

@Component({
  selector: 'app-todo-form',
  template: `
    <div class="todo-form-container">
      <h3>{{ todo ? 'Edit Todo' : 'Add New Todo' }}</h3>
      
      <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title" 
            formControlName="title" 
            class="form-control"
            placeholder="Enter todo title">
          <div class="error" *ngIf="todoForm.get('title')?.touched && todoForm.get('title')?.errors?.['required']">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            formControlName="description" 
            class="form-control"
            placeholder="Enter todo description"
            rows="3">
          </textarea>
        </div>

        <div class="form-group checkbox">
          <label>
            <input type="checkbox" formControlName="completed">
            Mark as completed
          </label>
        </div>

        <div class="error-message" *ngIf="error">{{ error }}</div>

        <div class="form-actions">
          <button type="submit" [disabled]="todoForm.invalid" class="btn btn-primary">
            {{ todo ? 'Update' : 'Add' }} Todo
          </button>
          <button type="button" (click)="onCancel()" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .todo-form-container {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h3 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #495057;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .checkbox input {
      margin: 0;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .error-message {
      color: #dc3545;
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #f8d7da;
      border-radius: 4px;
    }

    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class TodoFormComponent implements OnInit {
  @Input() todo: Todo | null = null;
  @Output() todoAdded = new EventEmitter<Todo>();
  @Output() todoUpdated = new EventEmitter<Todo>();
  @Output() cancelled = new EventEmitter<void>();

  todoForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService
  ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      completed: [false]
    });
  }

  ngOnInit() {
    if (this.todo) {
      this.todoForm.patchValue(this.todo);
    }
  }

  onSubmit() {
    if (this.todoForm.valid) {
      if (this.todo?._id) {
        // Update existing todo
        this.todoService.updateTodo(this.todo._id, this.todoForm.value)
          .subscribe({
            next: (updatedTodo) => {
              this.todoUpdated.emit(updatedTodo);
              this.error = '';
            },
            error: (err) => {
              console.error('Error updating todo:', err);
              this.error = 'Failed to update todo';
            }
          });
      } else {
        // Create new todo
        this.todoService.createTodo(this.todoForm.value)
          .subscribe({
            next: (newTodo) => {
              this.todoAdded.emit(newTodo);
              this.resetForm();
            },
            error: (err) => {
              console.error('Error creating todo:', err);
              this.error = 'Failed to create todo';
            }
          });
      }
    }
  }

  onCancel() {
    this.cancelled.emit();
    this.resetForm();
  }

  private resetForm() {
    this.todoForm.reset({ completed: false });
    this.error = '';
  }
}