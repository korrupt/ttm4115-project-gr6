import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ChargerUserEntity } from "./charger-user.entity";


@Entity('time-slot')
@Unique('UQ_TIME_SLOT', ["charger_id", "from", "to"])
export class TimeSlotEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz' })
  from!: string;

  @Column({ type: 'timestamptz' })
  to!: string;

  @ManyToOne(() => ChargerUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'charger_user_id' })
  charger_user!: ChargerUserEntity;

  @Column({ name: 'charger_user_id' })
  charger_user_id!: string;

  @Column({ name: 'charger_id', type: 'uuid' })
  charger_id!: string;
}
