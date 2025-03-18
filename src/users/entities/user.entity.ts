import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profilePhoto: string; // foto_perfil

  @Column({ nullable: true })
  favoriteTeamId: number; // time_favorito_id (FK para teams)

  @Column({ default: false })
  isAthlete: boolean; // is_athlete (true = atleta, false = usuário comum)

  @Column({ type: 'date', nullable: true })
  birthDate: Date; // data_nascimento

  @CreateDateColumn()
  createdAt: Date; // data_criacao
}