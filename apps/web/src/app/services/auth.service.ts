import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { AuthPayload } from "@prosjekt/shared/models";
import { BehaviorSubject, filter, last, map, Observable, switchMap, takeUntil } from "rxjs";
import { jwtDecode }  from 'jwt-decode';

const AUTH_KEY = 'auth.token';

@Injectable()
export class WebAuthService {
  constructor(
    private http: HttpClient,
  ){
    this.tryLogin();
  }

  private init = new BehaviorSubject(false);
  private user = new BehaviorSubject<AuthPayload | null>(null);
  id = inject(PLATFORM_ID);

  public tryLogin() {
    const token = this.access_token;

    if (token) {

      const payload = jwtDecode(token);

      if (payload) {
        if (new Date().getTime() < payload.exp! * 1000) {
          this.login(token);
        } else {
          this.access_token = null;
        }
      }

    }

    this.init.next(true);
  }

  public login(token: string) {
    this.access_token = token;
  }

  set access_token(token: string | null) {
    if (isPlatformBrowser(this.id)) {
      if (token) {
        localStorage.setItem(AUTH_KEY, token);
        this.user.next(jwtDecode(token));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }

  get access_token(): string | null {
    if (!isPlatformBrowser(this.id)) return null;

    const value = localStorage.getItem(AUTH_KEY);

    return value;
  }

  init$ = this.init.pipe(
    filter((e) => e)
  );

  user$: Observable<AuthPayload | null> = this.init$.pipe(
    switchMap(() => this.user)
  )
}
