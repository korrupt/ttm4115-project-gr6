
export interface ChargerRepository {
  // only save changes here
  save: (charger: Charger) => Promise<Charger>;
}

export interface ChargerProps {
  readonly id: string;
  name: string;
  location: [number, number];
}

export class Charger implements ChargerProps {
  readonly id!: string;
  name!: string;
  location!: [number, number];

  constructor(props: ChargerProps){
    Object.assign(this, props);
  }
}


