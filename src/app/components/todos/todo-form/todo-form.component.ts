// src/app/components/todos/todo-form/todo-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../models/todo';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
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
        this.todoService.updateTodo(this.todo._id, this.todoForm.value)
          .subscribe({
            next: (updatedTodo) => {
              this.todoUpdated.emit(updatedTodo);
            },
            error: (error) => {
              this.error = 'Failed to update todo';
            }
          });
      } else {
        this.todoService.createTodo(this.todoForm.value)
          .subscribe({
            next: (newTodo) => {
              this.todoAdded.emit(newTodo);
            },
            error: (error) => {
              this.error = 'Failed to create todo';
            }
          });
      }
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}