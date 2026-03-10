import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'admin_auth';
  private readonly adminPassword = 'admin123';

  login(password: string): boolean {
    if (password === this.adminPassword) {
      localStorage.setItem(this.storageKey, 'true');
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }
}