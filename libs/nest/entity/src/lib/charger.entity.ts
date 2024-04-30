import { ChargerType } from '@prosjekt/shared/models';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';

@Entity('charger')
export class ChargerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Index  ({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location!: Point;

  @Column({ default: 'DISABLED' })
  status!: string;

  @Column({ type: 'enum', enum: ChargerType, default: '{}', array: true })
  charger_types!: ChargerType[];
}
