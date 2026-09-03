import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type QueryParams = HttpParams | Record<string, string | number | boolean | string[]>;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(endpoint: string, params?: QueryParams): Observable<T> {
    return this.http.get<T>(endpoint, { params });
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(endpoint, body);
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(endpoint, body);
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(endpoint, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(endpoint);
  }
}

// import { ApiService } from '@core/services/api.service';
// import { API_ENDPOINTS } from '@core/config/api-endpoints';

// @Injectable({ providedIn: 'root' })
// export class UserService {
//   private api = inject(ApiService);

//   getUsers() {
//     return this.api.get<User[]>(API_ENDPOINTS.users.list);
//   }

//   getUserById(id: number) {
//     return this.api.get<User>(API_ENDPOINTS.users.detail(id));
//   }

//   createUser(data: CreateUserDto) {
//     return this.api.post<User>(API_ENDPOINTS.users.create, data);
//   }

//   updateUser(id: number, data: UpdateUserDto) {
//     return this.api.put<User>(API_ENDPOINTS.users.update(id), data);
//   }

//   deleteUser(id: number) {
//     return this.api.delete<void>(API_ENDPOINTS.users.delete(id));
//   }
// }
