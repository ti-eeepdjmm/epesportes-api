import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number; // ID do jogador (chave primária)

  @ManyToOne(() => User, { nullable: true })
  user: User | null; // FK para a tabela users (opcional)

  @ManyToOne(() => Team, { nullable: false })
  team: Team; // FK para a tabela teams (obrigatório)

  @Column()
  position: string; // Posição do jogador (ex.: goleiro, atacante)

  @Column()
  jerseyNumber: number; // Número da camisa do jogador
}
