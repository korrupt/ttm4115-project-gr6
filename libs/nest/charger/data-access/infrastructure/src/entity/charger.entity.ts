import { ChargerType } from '@prosjekt/shared/models';
import { Column, Entity, GeoJSON, PrimaryGeneratedColumn } from 'typeorm';

@Entity('charger')
export class ChargerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'point' })
  location!: GeoJSON;

  @Column({ type: 'enum', enum: ChargerType, default: '{}', array: true })
  charger_types!: ChargerType[];
}
