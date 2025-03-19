import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'text' })
  regras: string;

  @CreateDateColumn()
  criado_em: Date;
}
