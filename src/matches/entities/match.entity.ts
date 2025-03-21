import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, { nullable: false })
  game: Game;

  @ManyToOne(() => Team, { nullable: false })
  team1: Team;

  @ManyToOne(() => Team, { nullable: false })
  team2: Team;

  @Column({ type: 'int', default: 0 })
  score_team1: number;

  @Column({ type: 'int', default: 0 })
  score_team2: number;

  @Column({
    type: 'enum',
    enum: ['scheduled', 'in progress', 'completed'],
    default: 'scheduled',
  })
  status: string;

  @CreateDateColumn()
  dateTime: Date;
}
