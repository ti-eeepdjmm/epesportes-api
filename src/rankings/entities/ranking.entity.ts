import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Player } from '../../players/entities/player.entity';

@Entity()
export class Ranking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, { nullable: false })
  player: Player;

  @Column({ type: 'int', default: 0 })
  goals: number;

  @Column({ type: 'int', default: 0 })
  assists: number;

  @Column({ type: 'int', default: 0 })
  yellowCards: number;

  @Column({ type: 'int', default: 0 })
  redCards: number;
}