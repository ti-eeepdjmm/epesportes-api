import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UserPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'boolean', default: false })
  darkMode: boolean;

  @Column({ type: 'boolean', default: true })
  notificationsEnabled: boolean;
}
