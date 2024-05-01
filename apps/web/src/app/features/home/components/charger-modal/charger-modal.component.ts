import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { WebChargerService } from "../../../../services/charger.service";
import { ChargerModalStore } from "./store";
import { provideComponentStore } from "@ngrx/component-store";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";

import { interval, map, startWith, Subject, takeUntil, tap } from "rxjs";
import { GetChargerReservationsQueryResult } from "@prosjekt/shared/models";
import { WebAuthService } from "../../../../services/auth.service";


@Component({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDividerModule],
  selector: 'app-charger-modal-component',
  styleUrl: './charger-modal.component.scss',
  templateUrl: './charger-modal.component.html',
  standalone: true,
  providers: [
    provideComponentStore(ChargerModalStore)
  ]
})
export class ChargerModalComponent implements OnInit, OnDestroy {
  chargerService = inject(WebChargerService);
  store = inject(ChargerModalStore);
  auth = inject(WebAuthService);
  dialog = inject(MatDialogRef);

  destroy$ = new Subject<void>();

  readonly id: { id: string } = inject(MAT_DIALOG_DATA, {optional: false});

  loading$ = this.store.select((s) => s.charger.state === 'loading' || s.reservations.state === 'loading');

  charger$ = this.store.select((s) => s.charger.data);
  reservations$ = this.store.select((s) => s.reservations.data);

  name$ = this.charger$.pipe(
    map((c) => c?.name)
  )

  close() {
    this.dialog.close();
  }

  reserve(reservation: GetChargerReservationsQueryResult[number]) {
    this.auth.user$.pipe(
      tap((user) => {
        if (user) {
          this.store.addReservation$({ id: this.id.id, user_id: user.sub, from: reservation.from, to: reservation.to })
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    interval(500).pipe(
      takeUntil(this.destroy$),
      startWith(0),
    ).subscribe(() => {
      this.store.fetchCharger$({ id: this.id.id });
      this.store.fetchReservations$({ id: this.id.id });
    })
  }
}
