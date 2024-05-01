import { inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { WebChargerService } from "../../services/charger.service";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { WebUserService } from "../../services/user.service";
import { GetUserByIdQueryResult, GetUserReservationsQueryResult } from "@prosjekt/shared/models";
import { HttpErrorResponse } from "@angular/common/http";

type HttpResource<T> = {
  state: 'loading' | 'done' | 'error' | 'init';
  data?: T;
  error?: string;
}

export interface UserState {
  user: HttpResource<GetUserByIdQueryResult>;
  reservations: HttpResource<GetUserReservationsQueryResult>;
}

@Injectable()
export class UserStore extends ComponentStore<UserState> {
  constructor() {
    super({
      user: { state: 'init' },
      reservations: { state: 'init' }
    })
  }

  chargerService = inject(WebChargerService);
  userService = inject(WebUserService);

  loading$ = this.select((s) => s.user.state === 'loading' || s.reservations.state === 'loading');
  user$ = this.select((s) => s.user.data);
  reservations$ = this.select((s) => s.reservations.data);

  error$ = this.select((s) => [s.user.error, s.reservations.error]);

  removeReservation = this.effect<{ user_id: string; reservation_id: string }>((event$) => event$.pipe(
    tap(() => { this.patchState(({ reservations }) => ({  reservations: { ...reservations, state: 'loading' } })) }),
    switchMap(({ user_id, reservation_id }) => this.userService.deleteUserReservation(user_id, reservation_id)),
    tap(({id}) => {
      this.patchState((state) => {
        if (state.reservations.data) {
          const idx = state.reservations.data.findIndex((e) => e.id === id);

          if (idx > -1) {
            state.reservations.data.splice(idx, 1);
          }

        }

        return state;
      })
    }),
    catchError((e) => {
      console.log(e);

      if (e instanceof HttpErrorResponse) {
        this.patchState((reservations) => ({ reservations: { ...reservations, state: 'error', error: e.statusText } }))
      } else {
        this.patchState((reservations) => ({ reservations: { ...reservations, state: 'error', error: 'Error deleting reservation' } }))
      }

      return EMPTY;
    })
  ))

  fetchUser$ = this.effect<{ id: string }>((event$) => event$.pipe(
    tap(() => { this.patchState(({ user }) => ({  user: { ...user, state: 'loading' } })) }),
    switchMap(({id}) => this.userService.getUserById(id)),
    tap((data) => this.patchState((user) => ({ ...user, user: { data, state: 'done' } }))),
    catchError((e) => {
      console.log(e);

      if (e instanceof HttpErrorResponse) {
        this.patchState((user) => ({ user: { ...user, state: 'error', error: e.statusText } }))
      } else {
        this.patchState((user) => ({ user: { ...user, state: 'error', error: 'Error fetching user' } }))
      }

      return EMPTY;
    })
  ))

  fetchUserReservations$ = this.effect<{ id: string }>((event$) => event$.pipe(
    tap(() => { this.patchState(({ reservations }) => ({  reservations: { ...reservations, state: 'loading' } })) }),
    switchMap(({id}) => this.userService.getUserReservations(id)),
    tap((data) => this.patchState((reservations) => ({ ...reservations, reservations: { data, state: 'done' } }))),
    catchError((e) => {
      console.log(e);

      if (e instanceof HttpErrorResponse) {
        this.patchState((reservations) => ({ reservations: { ...reservations, state: 'error', error: e.statusText } }))
      } else {
        this.patchState((reservations) => ({ reservations: { ...reservations, state: 'error', error: 'Error fetching user' } }))
      }

      return EMPTY;
    })
  ))

}
