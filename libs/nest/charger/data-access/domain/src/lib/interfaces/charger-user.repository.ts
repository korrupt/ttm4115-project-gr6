import { ChargerUser } from "../aggregates/charger-user";

export interface ChargerUserRepository {
  findById: (id: string) => Promise<ChargerUser>
}
