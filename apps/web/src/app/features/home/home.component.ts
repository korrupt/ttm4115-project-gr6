import { Component, inject, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebAuthService } from '../../services/auth.service';
import { WebChargerService } from '../../services/charger.service';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker, MapMarker, MapMarkerClusterer } from "@angular/google-maps";
import { WebMapsService } from '../../services/maps.service';
import { BehaviorSubject, debounceTime, map, Subject, tap } from 'rxjs';

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
    MapAdvancedMarker,
    MapMarkerClusterer,
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

  // markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
  //   content: (() => {
  //     const marker = document.createElement('img');
  //     marker.src = "assets/charger.svg";

  //     return marker;
  //   })() as Node,
  // };


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
    mapId: process.env.MAPS_ID,
    clickableIcons: false,
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    console.log(event.latLng?.toJSON());
  }

  onMapMove() {
    this.trigger.next();
  }

  ngOnInit(): void {
    this.bounds$.subscribe()
  }

  chargers$ = this.charger.getAllChargers();

  user$ = this.auth.user$;
}
