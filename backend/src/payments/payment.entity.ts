import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Events } from 'event/events.entity';
import { Tickets } from 'tickets/tickets.entity';
import { Reservations } from 'reservations/reservations.entity';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn() id: number;

  @Column('int')
  @ManyToOne(type => Reservations, reservation => reservation.id)
  reservation_id: number;

  @Column({ length: 100 })
  order_number: string;

  @Column({ length: 100 })
  auth_code: string;

  @Column({ length: 100 })
  username: string;

  @Column({ default: false })
  payment_status: boolean;

  @Column({ length: 50 })
  payment_date: string;

  @Column('double precision') amount: number;
}
