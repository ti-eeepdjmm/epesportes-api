import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'auth_user_id', type: 'uuid', unique: true })
  authUserId: string;

  @Column({ nullable: true })
  profilePhoto: string;

  @ManyToOne(() => Team, { nullable: true })
  favoriteTeam: Team;

  @Column({ default: false })
  isAthlete: boolean;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  username: string;

  @CreateDateColumn()
  createdAt: Date;
}
