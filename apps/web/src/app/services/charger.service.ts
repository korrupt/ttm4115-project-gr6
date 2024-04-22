import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GetAllChargersQueryResult } from "@prosjekt/shared/models";


@Injectable()
export class WebChargerService {
  constructor(){
    this.getAllChargers().subscribe(console.log)
  }

  http = inject(HttpClient);


  getAllChargers() {
    return this.http.get<GetAllChargersQueryResult>("/api/charger")
  }

}
