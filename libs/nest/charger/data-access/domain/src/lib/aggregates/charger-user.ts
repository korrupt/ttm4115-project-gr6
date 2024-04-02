


export interface ChargerUserRepository {
  findById: (id: string) => Promise<ChargerUser>;
}

export type ChargerUserProps = {
  readonly id: string;

  has_reservation: boolean;
}

export class ChargerUser implements ChargerUserProps {
  readonly id!: string;
  has_reservation!: boolean;

  constructor(props: ChargerUserProps){
    Object.assign(this, props);
  }
}
