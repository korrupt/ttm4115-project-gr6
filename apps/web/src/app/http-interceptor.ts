import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { WebAuthService } from "./services/auth.service";
import { map, switchMap } from "rxjs";


export const WebHttpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(WebAuthService);

  return auth.init$.pipe(
    switchMap((payload) => next(payload ? req.clone({ setHeaders: { 'Authorization': `Bearer ${auth.access_token}` } }) : req))
  )
}
