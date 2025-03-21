import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class EngagementStat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'int', default: 0 })
  postsCreated: number;

  @Column({ type: 'int', default: 0 })
  commentsMade: number;

  @Column({ type: 'int', default: 0 })
  reactionsReceived: number;

  @Column({ type: 'int', default: 0 })
  videoViews: number;

  @UpdateDateColumn()
  lastUpdated: Date;
}
