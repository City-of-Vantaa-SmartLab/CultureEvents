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

  @Column({ length: 100 })
  location: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 500 })
  event_date: string;

  @Column({ length: 500 })
  event_time: string;

  @OneToMany(type => Price, price => price.events, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ticket_catalog: PriceDto[];

  @Column({ length: 30 })
  contact_information: string;

  @Column({ length: 30 })
  event_type: string;

  @Column({ length: 15 })
  age_group_limit: string;

  @Column() is_wordless: boolean;

  @Column() is_bilingual: boolean;

  @Column({ length: 500 })
  cover_image: string;

  @Column({ length: 30 })
  theme_color: string;

  @Column({ length: 50 })
  performer: string;
}
