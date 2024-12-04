// src/app/services/todo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Todo } from '../models/todo';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap(todos => console.log('Fetched todos:', todos)),
        catchError(this.handleError)
      );
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo, { headers: this.getHeaders() })
      .pipe(
        tap(newTodo => console.log('Created todo:', newTodo)),
        catchError(this.handleError)
      );
  }

updateTodo(id: string, todo: Todo): Observable<Todo> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.put<Todo>(url, todo, { headers: this.getHeaders() })
    .pipe(
      tap(updatedTodo => console.log('Updated todo:', updatedTodo)),
      catchError(error => {
        console.error('Error updating todo:', error);
        return throwError(() => 'Failed to update todo');
      })
    );
}

  deleteTodo(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, { headers: this.getHeaders() })
      .pipe(
        tap(() => console.log('Deleted todo:', id)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred. Please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Backend error
      if (error.status === 401) {
        errorMessage = 'Please login again.';
      } else if (error.status === 404) {
        errorMessage = 'Todo not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => errorMessage);
  }
}