import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GetAllChargersQueryResult, GetChargerByIdQueryResult } from "@prosjekt/shared/models";


@Injectable()
export class WebChargerService {
  http = inject(HttpClient);

  getAllChargers() {
    return this.http.get<GetAllChargersQueryResult>("/api/charger")
  }

  getChargerById(id: string) {
    return this.http.get<GetChargerByIdQueryResult>(`/api/charger/${id}`);
  }

}
