import { Component, inject, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebAuthService } from '../../services/auth.service';
import { WebChargerService } from '../../services/charger.service';
import { GoogleMap, GoogleMapsModule, MapMarker } from "@angular/google-maps";
import { WebMapsService } from '../../services/maps.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, interval, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ChargerModalComponent } from './components/charger-modal/charger-modal.component';
import { GetAllChargersQueryResult } from '@prosjekt/shared/models';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DARK_MODE_STYLES } from './util/maps-dark-mode';


@Pipe({
  pure: true,
  name: 'lnglat',
  standalone: true
})
export class LngLatPipe implements PipeTransform {
  transform(value: [number, number], ...args: any[]): google.maps.LatLng {
    return new google.maps.LatLng({lat: value[0], lng: value[1]})
  }
}





@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    LngLatPipe,
    MapMarker,
    ChargerModalComponent,
    MatDialogModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: []
})
export class HomeComponent implements OnInit, OnDestroy {
  auth = inject(WebAuthService);
  charger = inject(WebChargerService);
  maps = inject(WebMapsService);
  dialog = inject(MatDialog);

  destroy$ = new Subject<void>();

  trigger = new Subject<void>();

  dialogRef?: MatDialogRef<ChargerModalComponent>;


  bounds$ = this.trigger.pipe(
    debounceTime(100),
    map(() => this.map.getBounds()),
    tap(console.log)
  )

  @ViewChild('map', { static: true })
  private map!: GoogleMap;

  points$ = new BehaviorSubject([]);

  makeContent(): Node {
    const marker = document.createElement('img');
    marker.src = "assets/charger.svg";

    return marker;
  }

  options: google.maps.MapOptions = {
    center: {
      lat: 63.425394,
      lng: 10.4057613,
    },
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    keyboardShortcuts: false,
    mapId: process.env['MAPS_ID'],
    clickableIcons: false,
    styles: DARK_MODE_STYLES,
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    console.log(event.latLng?.toJSON());
  }

  onMapMove() {
    this.trigger.next();
  }

  onChargerClick(charger: GetAllChargersQueryResult[number], event: google.maps.MapMouseEvent) {
    if (this.dialogRef) {
      // if (this.dialogRef.componentInstance.id.id == charger.id) return;

      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(ChargerModalComponent, {
      data: { id: charger.id },
      position: {
        right: '24px',
        top: '64px',
      },
      width: '300px',
      minHeight: '500px',
      hasBackdrop: false
    });

    this.dialogRef.beforeClosed().pipe(takeUntil(this.destroy$)).subscribe(() => delete this.dialogRef);
  }

  ngOnInit(): void {

    interval(500).pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.charger.getAllChargers())
    ).subscribe((result) => this.chargers.next(result))

  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  chargers = new BehaviorSubject<GetAllChargersQueryResult>([]);
  chargers$ = this.chargers.asObservable().pipe(

  )

  user$ = this.auth.user$;
}
