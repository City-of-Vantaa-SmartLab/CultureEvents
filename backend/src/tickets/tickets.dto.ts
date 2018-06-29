import { IsNumber } from 'class-validator';
export class TicketsDto {
  @IsNumber() private readonly price_id: number;
  @IsNumber() private readonly no_tickets: number;
}
