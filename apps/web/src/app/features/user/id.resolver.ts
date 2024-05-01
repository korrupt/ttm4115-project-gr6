import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { WebAuthService } from "../../services/auth.service";
import { map } from "rxjs";


export const idResolver: ResolveFn<string | null> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(WebAuthService);

  return auth.user$.pipe(
    map((auth) => auth ? auth.sub : null)
  );
}
