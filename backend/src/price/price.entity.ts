import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Events } from '../event/events.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn() id: number;

  @Column('double precision') price: number;

  @Column({ length: 200 })
  ticket_description: string;

  @Column({ type: 'int', nullable: true })
  max_seats: number;

  @Column({ type: 'int', nullable: true })
  occupied_seats: number;

  @ManyToOne(_ => Events, event => event.ticket_catalog)
  events: Events;
}
