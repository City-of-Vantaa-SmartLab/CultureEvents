import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Price } from '../price/price.entity';
import { Reservations } from '../reservations/reservations.entity';

@Entity()
export class Tickets {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(type => Price, price => price.id)
  @Column()
  price_id: number;

  @Column() no_of_tickets: number;

  @ManyToOne(type => Reservations, reservations => reservations.tickets)
  tickets: Reservations;
}
