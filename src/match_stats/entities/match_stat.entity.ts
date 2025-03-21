import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity()
export class MatchStat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, { nullable: false })
  match: Match;

  @ManyToOne(() => Team, { nullable: false })
  team: Team;

  @Column({ type: 'int', default: 0 })
  goals: number;

  @Column({ type: 'jsonb', nullable: true })
  playersGoals: Record<string, number>; // Ex: { "Player 1": 2, "Player 2": 1 }

  @Column({ type: 'int', default: 0 })
  fouls: number;

  @Column({ type: 'int', default: 0 })
  shots: number;

  @Column({ type: 'int', default: 0 })
  penalties: number;

  @Column({ type: 'float', default: 0 })
  possession: number; // % of ball possession
}
