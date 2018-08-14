import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Price } from '../price/price.entity';
import { PriceDto } from 'price/price.dto';
import { Reservations } from 'reservations/reservations.entity';

@Entity()
export class Events {
  @OneToMany(type => Reservations, reservations => reservations.event_id)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  name: string;

  @Column({ length: 500 })
  location: string;

  @Column({ length: 3000 })
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

  @Column({ length: 300 })
  contact_information: string;

  @Column({ length: 300 })
  event_type: string;

  @Column({ length: 300, nullable: true })
  age_group_limits: string;

  @Column() is_wordless: boolean;

  @Column() is_bilingual: boolean;

  @Column({ nullable: true })
  area: string;

  @Column({ length: 1000 })
  cover_image: string;

  @Column({ length: 300 })
  theme_color: string;

  @Column({ length: 100 })
  performer: string;
}
