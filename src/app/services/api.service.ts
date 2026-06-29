import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export interface Post {
  userId?: number;
  id?: number;
  title: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {

  // URL base de la API
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  // Opciones HTTP con cabecera Content-Type
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error del cliente: ${error.error.message}`;
    } else {
      errorMsg = `Error del servidor ${error.status}: ${error.message}`;
    }
    console.error(errorMsg);
    return throwError(() => new Error(errorMsg));
  }

  // ── READ: obtener todos los posts ─────────────────────────────
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // ── READ: obtener un post por ID ──────────────────────────────
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // ── CREATE: crear un nuevo post ───────────────────────────────
  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(
      `${this.baseUrl}/posts`,
      JSON.stringify(post),
      this.httpOptions
    ).pipe(retry(1), catchError(this.handleError));
  }

  // ── UPDATE: modificar un post por ID ─────────────────────────
  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(
      `${this.baseUrl}/posts/${id}`,
      JSON.stringify(post),
      this.httpOptions
    ).pipe(retry(1), catchError(this.handleError));
  }

  // ── DELETE: eliminar un post por ID ──────────────────────────
  deletePost(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/posts/${id}`,
      this.httpOptions
    ).pipe(retry(1), catchError(this.handleError));
  }
}
