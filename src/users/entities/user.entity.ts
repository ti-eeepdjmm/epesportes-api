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
  id: number; // ID interno da tabela (auto incremental)

  @Column()
  name: string; // Nome do usuário

  @Column({ name: 'auth_user_id', type: 'uuid', unique: true })
  authUserId: string; // UUID do usuário no Supabase Auth

  @Column({ nullable: true })
  profilePhoto: string; // Foto de perfil (opcional)

  @ManyToOne(() => Team, { nullable: true })
  favoriteTeam: Team; // Time favorito

  @Column({ default: false })
  isAthlete: boolean; // É atleta?

  @Column({ type: 'date', nullable: true })
  birthDate: Date; // Data de nascimento

  @CreateDateColumn()
  createdAt: Date;
}
