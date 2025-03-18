import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // ID do usuário (chave primária)

  @Column()
  name: string; // Nome do usuário

  @Column({ unique: true })
  email: string; // Email único

  @Column()
  password: string; // Senha (hash)

  @Column({ nullable: true })
  profilePhoto: string; // Foto de perfil (opcional)

  @ManyToOne(() => Team, { nullable: true })
  favoriteTeam: Team; // Time favorito (FK para teams, opcional)

  @Column({ default: false })
  isAthlete: boolean; // Indica se é atleta (true) ou usuário comum (false)

  @Column({ type: 'date', nullable: true })
  birthDate: Date; // Data de nascimento (opcional)

  @CreateDateColumn()
  createdAt: Date; // Data de criação (preenchida automaticamente pelo TypeORM)
}