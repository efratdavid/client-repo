import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeBlockService {
  private baseUrl = 'http://localhost:3000/coding-application'; 

  constructor(private http: HttpClient) { }

  // Fetch all code blocks
  getCodeBlocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/codeblocks`);
  }

  // Fetch a single code block by ID
  getCodeBlockById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/codeblocks/${id}`);
  }
}
