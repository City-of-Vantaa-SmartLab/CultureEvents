import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Events } from '../event/events.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn() id: number;

  @Column('double precision') price: number;

  @Column({ length: 30 })
  type: string;

  @Column({ length: 200 })
  description: string;

  @Column('int') seats: number;

  @ManyToOne(type => Events, event => event.pricing)
  events: Events;
}
