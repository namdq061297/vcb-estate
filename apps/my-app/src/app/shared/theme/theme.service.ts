import { Injectable } from '@angular/core';

export type UserType = 'priority' | 'normal';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  setTheme(type: UserType) {
    const body = document.body;

    body.classList.remove(
      'theme-priority',
      'theme-normal'
    );

    body.classList.add(`theme-${type}`);
  }
}

//example usage in app.component.ts
// constructor(
//   private themeService: ThemeService
// ) {}

// ngOnInit() {
//   const userType =
//     localStorage.getItem('userType') as 'priority' | 'normal';

//   this.themeService.setTheme(
//     userType || 'normal'
//   );
// }