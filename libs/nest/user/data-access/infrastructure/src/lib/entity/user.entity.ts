import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
