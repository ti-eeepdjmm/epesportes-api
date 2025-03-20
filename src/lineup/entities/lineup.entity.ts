import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Match } from '../../matches/entities/match.entity';
import { Player } from '../../players/entities/player.entity';

@Entity()
export class Lineup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, { nullable: false })
  team: Team;

  @ManyToOne(() => Match, { nullable: false })
  match: Match;

  @ManyToOne(() => Player, { nullable: false })
  player: Player;

  @Column({ type: 'boolean', default: false })
  titular: boolean;
}
