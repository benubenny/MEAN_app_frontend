// src/app/components/todos/todo-form/todo-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Todo } from '../../../models/todo';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="todo-form-container">
      <h2>{{ todo ? 'Edit Todo' : 'Add New Todo' }}</h2>
      <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title"
            formControlName="title"
            class="form-control" 
            placeholder="Enter todo title">
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            formControlName="description"
            class="form-control" 
            rows="3"
            placeholder="Enter todo description">
          </textarea>
        </div>

        <div class="form-check">
          <input 
            type="checkbox" 
            id="completed"
            formControlName="completed"
            class="form-check-input">
          <label class="form-check-label" for="completed">
            Mark as completed
          </label>
        </div>

        <div class="button-group">
          <button type="submit" class="btn btn-primary">
            {{ todo ? 'Update' : 'Add' }} Todo
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .todo-form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    textarea.form-control {
      min-height: 100px;
      resize: vertical;
    }

    .form-check {
      margin: 1rem 0;
    }

    .form-check-input {
      margin-right: 0.5rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary {
      background-color: #28a745;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn:hover {
      opacity: 0.9;
    }
  `]
})
export class TodoFormComponent {
  @Input() todo: Todo | null = null;
  @Output() todoAdded = new EventEmitter<Todo>();
  @Output() todoUpdated = new EventEmitter<Todo>();
  @Output() cancelled = new EventEmitter<void>();

  todoForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
        this.todoUpdated.emit({ ...this.todo, ...this.todoForm.value });
      } else {
        this.todoAdded.emit(this.todoForm.value);
      }
      this.todoForm.reset({ completed: false });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}