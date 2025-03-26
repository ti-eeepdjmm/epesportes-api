// entities/mention.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
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
  mentionedUser: User;

  @ManyToOne(() => User, { nullable: false })
  senderUser: User;

  @ManyToOne(() => Player, { nullable: true })
  mentionedPlayer: Player | null;

  @CreateDateColumn()
  mentionDate: Date;
}
