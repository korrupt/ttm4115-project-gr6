import { TimeSlot } from "./aggregates/time-slot";



export interface ChargingStationRepository {
  save: (station: ChargingStation) => Promise<ChargingStation>;
}

export type ChargingStationProps = {
  readonly id: string;
  name: string;
  location: [number, number];

  /** used to notify people of a new spot if anyone leaves */
  reserved_timeslots: TimeSlot[];
}

export class ChargingStation implements ChargingStationProps {
  readonly id!: string;
  name!: string;
  location!: [number, number];
  reserved_timeslots!: TimeSlot[];

  constructor(props: ChargingStationProps) {
    Object.assign(this, props);
  }
}
