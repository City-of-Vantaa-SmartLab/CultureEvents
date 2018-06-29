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

@Entity()
export class Reservations {
  @PrimaryGeneratedColumn() id: number;

  @Column('int')
  @ManyToOne(type => Events, event => event.id)
  event_id: number;

  @Column({ length: 30 })
  username: string;

  @Column({ length: 15 })
  type: string;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 15 })
  phone_number: string;

  @Column({ length: 100 })
  email: string;

  @Column('double precision') total_amount: number;

  @OneToMany(type => Tickets, tickets => tickets.tickets, {
    cascade: true,
  })
  tickets: Tickets[];
}
