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
  @ManyToOne(type => Events, event => event.id, {
    cascade: true,
  })
  event_id: number;

  @Column({ length: 30, nullable: true })
  name: string;

  @Column({ length: 15 })
  customer_type: string;

  @Column({ length: 100, nullable: true })
  school_name: string;

  @Column({ length: 100, nullable: true })
  class: string;

  @Column({ length: 15 })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @OneToMany(type => Tickets, tickets => tickets.tickets, {
    cascade: true,
  })
  tickets: Tickets[];

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: false })
  sms_sent: boolean;

  @Column({ default: false })
  cancelled: boolean;
}
