import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('charger-user')
export class ChargerUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
