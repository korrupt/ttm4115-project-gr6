import { ComponentStore } from "@ngrx/component-store";
import { GetChargerByIdQueryResult, GetChargerReservationsQueryResult } from "@prosjekt/shared/models";
import { WebChargerService } from "../../../../services/charger.service";
import { catchError, EMPTY, of, switchMap, tap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Moment } from "moment-timezone";

type HttpResource<T> = {
  state: 'loading' | 'done' | 'error' | 'init';
  data?: T;
  error?: string;
}

export interface ChargerState {
  charger: HttpResource<GetChargerByIdQueryResult>;
  reservations: HttpResource<GetChargerReservationsQueryResult>;
  // loading: boolean;
  // error?: string;
  // charger?: GetChargerByIdQueryResult;
  // reservations?: GetChargerReservationsQueryResult;
}


@Injectable()
export class ChargerModalStore extends ComponentStore<ChargerState> {
  constructor(
    private chargerService: WebChargerService,
  ){
    super({
      charger: { state: 'init' },
      reservations: { state: 'init' }
    });
  }


  addReservation$ = this.effect<{ id: string, user_id: string; from: string; to: string }>((event$) => event$.pipe(
    switchMap(({ id, from, to, user_id }) => this.chargerService.reserveCharger(id, from, to, user_id).pipe(
      tap(() => {
        this.patchState((state) => {
          if (state.reservations.data) {
            const idx = state.reservations.data.findIndex((e) => e.from == from && e.to == to);

            if (idx > -1) {
              state.reservations.data[idx].reserved = true;
            }
          }

          return state;
        });
      }),
      catchError((e) => {
        if (e instanceof HttpErrorResponse) {
          this.patchState({ reservations: { state: 'error', error: e.statusText } });
        } else {
          this.patchState({ reservations: { state: 'error', error: 'Error getting charger' }})
        }

        return EMPTY;
      })
    )
  )))

  fetchCharger$ = this.effect<{ id: string }>((event$) => event$.pipe(switchMap(({ id }) => this.chargerService.getChargerById(id).pipe(
    tap((charger) => {
      this.setState((state) => ({ ...state, charger: { state: 'done', data: charger } }));
    }),
    catchError((e) => {
      if (e instanceof HttpErrorResponse) {
        this.patchState({ charger: { state: 'error', error: e.statusText } });
      } else {
        this.patchState({ charger: { state: 'error', error: 'Error getting charger' }})
      }

      return EMPTY;
    })
  ))));

  fetchReservations$ = this.effect<{ id: string }>((event$) => event$.pipe(switchMap(({ id }) => this.chargerService.getChargerReservations(id).pipe(
    tap((reservations) => {
      this.setState((state) => ({ ...state, reservations: { state: 'done', data: reservations } }));
    }),
    catchError((e) => {
      if (e instanceof HttpErrorResponse) {
        this.patchState({ reservations: { state: 'error', error: e.statusText } });
      } else {
        this.patchState({ reservations: { state: 'error', error: 'Error getting charger' }})
      }

      return EMPTY;
    })
  ))));

}
