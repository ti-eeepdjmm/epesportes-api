import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number; // ID do time (chave primária)

  @Column()
  name: string; // Nome do time

  @Column({ nullable: true })
  logo: string; // URL ou caminho do logo do time (opcional)

  @CreateDateColumn()
  createdAt: Date; // Data de criação (preenchida automaticamente pelo TypeORM)
}