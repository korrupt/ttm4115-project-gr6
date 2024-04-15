import { UserEntity } from '@prosjekt/nest/user/data-access/infrastructure';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
}

@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ enum: AuthProvider, type: 'enum' })
  provider!: AuthProvider;

  @Column()
  sub!: string;

  @Column()
  email!: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'user_id' })
  user_id!: string;
}
