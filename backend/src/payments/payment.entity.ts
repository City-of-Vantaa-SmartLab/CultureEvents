import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Reservations } from '../reservations/reservations.entity';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn() id: number;

  @Column('int')
  @ManyToOne(_ => Reservations, reservation => reservation.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  reservation_id: number;

  @Column({ length: 300 })
  order_number: string;

  @Column({ length: 300 })
  auth_code: string;

  @Column({ length: 300 })
  username: string;

  @Column({ default: false })
  payment_status: boolean;

  @Column({})
  @Column({ length: 100 })
  payment_date: string;

  @Column('double precision') amount: number;
}
