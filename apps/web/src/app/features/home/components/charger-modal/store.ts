import { ComponentStore } from "@ngrx/component-store";
import { GetChargerByIdQueryResult } from "@prosjekt/shared/models";
import { WebChargerService } from "../../../../services/charger.service";
import { catchError, EMPTY, of, switchMap, tap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface ChargerState {
  loading: boolean;
  error?: string;
  charger?: GetChargerByIdQueryResult;
}


@Injectable()
export class ChargerModalStore extends ComponentStore<ChargerState> {
  constructor(
    private chargerService: WebChargerService,
  ){
    super({
      loading: false,
    });
  }


  fetchCharger$ = this.effect<{ id: string }>((event$) => event$.pipe(switchMap(({ id }) => this.chargerService.getChargerById(id).pipe(
    tap((charger) => {
      this.setState((state) => ({ ...state, charger, loading: false }));
    }),
    catchError((e) => {
      if (e instanceof HttpErrorResponse) {
        this.patchState({ error: e.statusText, loading: false });
      } else {
        this.patchState({ error: 'Error getting charger', loading: false })
      }

      return EMPTY;
    })
  ))));

}
