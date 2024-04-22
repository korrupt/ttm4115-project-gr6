import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";


@Injectable()
export class WebMapsService {

  id = inject(PLATFORM_ID);

  public async loadScript(): Promise<void> {
    if (!isPlatformBrowser(this.id)) return;

    await new Promise<void>((res, rej) => {
        // const el = new HTMLScriptElement();
        const el = document.createElement('script');
        el.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_KEY}&loading=async`;

        el.onload = () => {
          setTimeout(() => {
            res();
          }, 100);
        };
        el.onerror = () => rej();
        el.onabort = () => rej();


        document.head.append(el);
    });

    await google.maps.importLibrary('maps');
    await google.maps.importLibrary('marker');
  }
}
