import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Events } from '../event/events.entity';
import { Tickets } from '../tickets/tickets.entity';
import * as dateFns from 'date-fns';

@Entity()
export class Reservations {
  @PrimaryGeneratedColumn() id: number;

  @Column('int')
  @ManyToOne(_ => Events, event => event.id, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  event_id: number;

  @Column({ length: 300, nullable: true })
  name: string;

  @Column({ length: 100 })
  customer_type: string;

  @Column({ length: 300, nullable: true })
  school_name: string;

  @Column({ length: 300, nullable: true })
  class: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @OneToMany(_ => Tickets, tickets => tickets.tickets, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  tickets: Tickets[];

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: false })
  sms_sent: boolean;

  @Column({ default: false })
  cancelled: boolean;

  @Column({ default: false })
  payment_completed: boolean;

  @Column({ type: 'timestamp without time zone', default: dateFns.format(new Date(), 'YYYY-MM-DD HH:mm') })
  created: string;

  @Column({ default: false })
  payment_required: boolean;

}
