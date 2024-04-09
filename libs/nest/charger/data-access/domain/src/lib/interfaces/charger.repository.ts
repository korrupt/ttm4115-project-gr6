import { Charger } from '../charger';

export interface ChargerRepository {
  newId(): Promise<string>;
  findById: (id: string) => Promise<Charger>;
  findWithTimeSlots: (id: string, from: Date, to: Date) => Promise<Charger>;
  exists: (id: string) => Promise<Charger>;
  // only save changes here
  save: (charger: Charger) => Promise<Charger>;
  remove: (charger: Charger) => Promise<void>;
}
