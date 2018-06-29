import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Price } from '../price/price.entity';
import { PriceDto } from 'price/price.dto';
import { Reservations } from 'reservations/reservations.entity';

@Entity()
export class Events {
  @OneToMany(type => Reservations, reservations => reservations.event_id)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 15 })
  type: string;

  @Column({ length: 15 })
  age_group: string;

  @Column({ length: 500 })
  desciption: string;

  @Column({ type: 'timestamp', nullable: false })
  event_date: string;

  @Column({ length: 15 })
  location: string;

  @OneToMany(type => Price, price => price.events, {
    cascade: true,
  })
  pricing: PriceDto[];

  @Column('int') tickets_available: number;

  @Column({ length: 30 })
  contact_info: string;

  @Column({ length: 30 })
  performer: string;

  @Column() bilingual: boolean;

  @Column() wordless: boolean;
}
