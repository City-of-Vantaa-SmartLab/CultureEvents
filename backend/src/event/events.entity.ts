import { Entity, Column, PrimaryGeneratedColumn, Double } from 'typeorm';

@Entity()
export class Events {
  @PrimaryGeneratedColumn() id: number;

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

  @Column('double precision') child_price: number;

  @Column('double precision') adult_price: number;

  @Column('int') tickets_available: number;

  @Column({ length: 15 })
  contact_number: string;
}
