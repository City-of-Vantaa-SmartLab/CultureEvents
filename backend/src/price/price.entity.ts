import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Events } from '../event/events.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn() id: number;

  @Column('double precision') price: number;

  @Column({ length: 200 })
  ticket_description: string;

  @Column('int') available_seat_for_this_type: number;

  @ManyToOne(type => Events, event => event.ticket_catalog, {
    onDelete: 'CASCADE',
  })
  events: Events;
}
