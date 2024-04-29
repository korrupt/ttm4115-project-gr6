import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AddReservationCommandResult, GetAllChargersQueryResult, GetChargerByIdQueryResult, GetChargerReservationsQueryResult } from "@prosjekt/shared/models";


@Injectable()
export class WebChargerService {
  http = inject(HttpClient);

  getAllChargers() {
    return this.http.get<GetAllChargersQueryResult>("/api/charger")
  }

  getChargerById(id: string) {
    return this.http.get<GetChargerByIdQueryResult>(`/api/charger/${id}`);
  }

  getChargerReservations(id: string) {
    return this.http.get<GetChargerReservationsQueryResult>(`/api/charger/${id}/reservation`);
  }

  reserveCharger(id: string, from: string, to: string, user_id: string) {
    return this.http.post<AddReservationCommandResult>(`/api/charger/${id}/reservation`, { from, to, user_id });
  }

}
