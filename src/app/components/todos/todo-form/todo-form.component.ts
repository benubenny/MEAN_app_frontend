import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
      <h2>{{ isEditMode ? 'Edit Todo' : 'Add New Todo' }}</h2>
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
          <button type="submit" class="btn btn-primary" [disabled]="!todoForm.valid">
            {{ isEditMode ? 'Update' : 'Add' }} Todo
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

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class TodoFormComponent implements OnInit {
  @Input() todo: Todo | null = null;
  @Output() todoAdded = new EventEmitter<Todo>();
  @Output() todoUpdated = new EventEmitter<Todo>();
  @Output() cancelled = new EventEmitter<void>();

  todoForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      completed: [false]
    });
  }

  ngOnInit() {
    this.todoForm.reset();
    if (this.todo) {
      this.isEditMode = true;
      this.todoForm.patchValue({
        title: this.todo.title,
        description: this.todo.description || '',
        completed: this.todo.completed || false
      });
    } else {
      this.isEditMode = false;
      this.todoForm.reset({
        title: '',
        description: '',
        completed: false
      });
    }
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      if (this.isEditMode && this.todo?._id) {
        this.todoUpdated.emit({
          _id: this.todo._id,
          title: formValue.title,
          description: formValue.description,
          completed: formValue.completed
        });
      } else {
        this.todoAdded.emit(formValue);
      }
    }
  }

  onCancel() {
    this.todoForm.reset();
    this.cancelled.emit();
  }
}