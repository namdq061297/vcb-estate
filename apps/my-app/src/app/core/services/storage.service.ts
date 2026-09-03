import { inject, Injectable } from '@angular/core';
import { JSONSchema, StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

// private storage = inject(StorageService);

// this.storage.save('user', { name: 'Na m', age: 25 }).subscribe();
// this.storage.load<User>('user', { type: 'object' }).subscribe(user => console.log(user));
// this.storage.update<User>('user', { age: 26 }, { type: 'object' }).subscribe();
// this.storage.delete('user').subscribe();

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storage = inject(StorageMap);

  load<T>(key: string, schema: JSONSchema): Observable<T | undefined> {
    return this.storage.get<T>(key, schema) as Observable<T | undefined>;
  }

  save<T>(key: string, value: T): Observable<undefined> {
    return this.storage.set(key, value);
  }

  update<T>(key: string, value: Partial<T>, schema: JSONSchema): Observable<undefined> {
    return new Observable((observer) => {
      this.load<T>(key, schema).subscribe({
        next: (existing) => {
          const updated =
            existing && typeof existing === 'object' ? { ...existing, ...value } : value;
          this.save(key, updated).subscribe({
            next: () => observer.next(undefined),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
        },
        error: (err) => observer.error(err),
      });
    });
  }

  delete(key: string): Observable<undefined> {
    return this.storage.delete(key);
  }

  clear(): Observable<undefined> {
    return this.storage.clear();
  }

  has(key: string): Observable<boolean> {
    return this.storage.has(key);
  }

  keys(): Observable<string> {
    return this.storage.keys();
  }
}
