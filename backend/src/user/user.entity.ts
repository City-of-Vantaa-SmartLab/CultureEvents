import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 30, unique: true })
  username: string;

  @Column() password: string;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  token_issued: number;

  @Column({ nullable: true })
  token_expiry: number;

  @Column({ default: false })
  logged_in: boolean;
}
