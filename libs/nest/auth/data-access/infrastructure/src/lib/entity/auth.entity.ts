import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
}

@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ enum: AuthProvider, type: 'enum' })
  prvoider!: AuthProvider;

  @Column()
  sub!: string;

  @Column()
  email!: string;

  @Column({ name: 'user_id' })
  user_id!: string;
}
