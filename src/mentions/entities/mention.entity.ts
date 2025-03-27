import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Player } from '../../players/entities/player.entity';

@Entity()
export class Mention {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  postId: string;

  @Column({ nullable: true })
  commentId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'mentionedUserId' })
  mentionedUser: User;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'senderUserId' })
  senderUser: User;

  @ManyToOne(() => Player, { nullable: true })
  @JoinColumn({ name: 'mentionedPlayerId' })
  mentionedPlayer: Player | null;

  @CreateDateColumn()
  mentionDate: Date;
}
