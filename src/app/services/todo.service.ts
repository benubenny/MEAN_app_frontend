// src/app/services/todo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api/todos'; // Make sure this matches your backend URL

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  updateTodo(id: string, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}