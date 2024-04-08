import { ChargerType } from '@prosjekt/shared/models';
import { Column, Entity, GeoJSON, Point, PrimaryGeneratedColumn } from 'typeorm';

@Entity('charger')
export class ChargerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'point' })
  location!: Point;

  @Column({ type: 'enum', enum: ChargerType, default: '{}', array: true })
  charger_types!: ChargerType[];
}
