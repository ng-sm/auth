import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { decodeJWT } from '../helpers';
import { AuthResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  accessTokenKey = 'accessToken';
  isLoading$ = new BehaviorSubject<boolean>(false);
  user: Record<string, any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.setUser();
  }

  get accessToken(): string {
    return localStorage.getItem(this.accessTokenKey);
  }

  setToken({ accessToken }: AuthResponse): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  setUser(): void {
    if (!this.accessToken) {
      return;
    }

    const jwtResponse = decodeJWT(this.accessToken);
    this.user = jwtResponse.user;
  }

  loginSuccess(response: AuthResponse): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.setToken(response);
    this.setUser();
    this.router.navigate([returnUrl]);
  }


  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    window.location.href = '/';
  }


  permissionDenied(): void {
    this.router.navigate(['/403']);
  }
}
