import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity('time-slot')
@Unique('UQ_TIME_SLOT', ["charger_id", "from", "to"])
export class TimeSlotEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz' })
  from!: string;

  @Column({ type: 'timestamptz' })
  to!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'user_id' })
  user_id!: string;

  @Column({ name: 'charger_id', type: 'uuid' })
  charger_id!: string;
}
