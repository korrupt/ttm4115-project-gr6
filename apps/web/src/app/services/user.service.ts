import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { GetUserByIdQueryResult, GetUserQueryResult, GetUserReservationsQueryResult } from "@prosjekt/shared/models";


@Injectable()
export class WebUserService {
  http = inject(HttpClient);


  getUser() {
    return this.http.get<GetUserQueryResult>(`/api/user`);
  }

  getUserById(id: string) {
    return this.http.get<GetUserByIdQueryResult>(`/api/user/${id}`);
  }

  getUserReservations(id: string) {
    return this.http.get<GetUserReservationsQueryResult>(`/api/user/${id}/reservations`);
  }

  deleteUserReservation(user_id: string, reservation_id: string) {
    return this.http.delete<{ id: string }>(`/api/user/${user_id}/reservations/${reservation_id}`);
  }
}
