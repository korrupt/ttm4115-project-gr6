import { Component, inject, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebAuthService } from '../../services/auth.service';
import { WebChargerService } from '../../services/charger.service';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker, MapMarker, MapMarkerClusterer } from "@angular/google-maps";
import { WebMapsService } from '../../services/maps.service';
import { BehaviorSubject, debounceTime, map, Subject, tap } from 'rxjs';
import { ChargerModalComponent } from './components/charger-modal/charger-modal.component';
import { GetAllChargersQueryResult } from '@prosjekt/shared/models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  providers: [

  ]
})
export class HomeComponent implements OnInit {
  auth = inject(WebAuthService);
  charger = inject(WebChargerService);
  maps = inject(WebMapsService);
  dialog = inject(MatDialog);

  trigger = new Subject<void>();


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
    console.log(charger, event)
  }

  ngOnInit(): void {
    this.bounds$.subscribe();

    this.dialog.open(ChargerModalComponent, {
      position: { top: '10px', left: '50px' },
      width: '200px',
      height: '200px',
    });
  }

  chargers$ = this.charger.getAllChargers();

  user$ = this.auth.user$;
}
