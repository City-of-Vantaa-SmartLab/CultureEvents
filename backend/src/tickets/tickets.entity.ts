import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Price } from '../price/price.entity';
import { Reservations } from '../reservations/reservations.entity';

@Entity()
export class Tickets {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(_ => Price, price => price.id, { onDelete: 'CASCADE' })
  @Column()
  price_id: number;

  @Column() no_of_tickets: number;

  @ManyToOne(_ => Reservations, reservations => reservations.tickets, { onDelete: 'CASCADE' })
  tickets: Reservations;
}
