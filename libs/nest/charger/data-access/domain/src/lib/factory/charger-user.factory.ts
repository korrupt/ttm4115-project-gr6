import { ChargerUser, ChargerUserProps } from "../aggregates";

type CreateChargerUserOptions = ChargerUserProps;

export class ChargerUserFactory {
  static create(options: CreateChargerUserOptions): ChargerUser {
    return new ChargerUser(options);
  }

  static reconstitute(props: ChargerUserProps): ChargerUser {
    return new ChargerUser(props);
  }
}
