import { inject, Injectable } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { WebAuthService } from "./services/auth.service";
import { map, tap } from "rxjs";


export const isLoggedIn: CanActivateFn = () => {
  const auth = inject(WebAuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    map((user) => !!user),
    tap((user) => {
      if (!user)
        router.navigate(["/auth"])
    })
  )
}
