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

  @Column({ length: 100, nullable: true })
  classroom: string;

  @Column({ length: 15, nullable: true })
  phone_number: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'double precision', nullable: true })
  total_amount: number;

  @OneToMany(type => Tickets, tickets => tickets.tickets, {
    cascade: true,
  })
  tickets: Tickets[];
}
