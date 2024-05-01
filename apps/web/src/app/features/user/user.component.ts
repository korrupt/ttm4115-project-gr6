import { Component, inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from './store';
import { WebAuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { provideComponentStore } from '@ngrx/component-store';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [
    provideComponentStore(UserStore),
  ]
})
export class UserComponent implements OnInit, OnDestroy {
  store = inject(UserStore);
  auth = inject(WebAuthService);
  route = inject(ActivatedRoute);
  destroy$ = new Subject<void>();

  get id(): string {
    return this.route.snapshot.data['id'];
  }

  user$ = this.store.user$;
  reservations$ = this.store.reservations$;

  remove(reservation_id: string) {
    this.store.removeReservation({ user_id: this.id, reservation_id });
  }

  ngOnInit(): void {
    this.store.fetchUser$({ id: this.id });
    this.store.fetchUserReservations$({ id: this.id });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
