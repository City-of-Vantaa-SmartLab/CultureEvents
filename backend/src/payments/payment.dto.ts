import { IsString, IsNumber } from 'class-validator';
export class PaymentsDto {
  @IsNumber()
  readonly reservation_id: number;

  @IsString()
  readonly order_number: string;

  @IsString()
  readonly payment_status: boolean;

  @IsString()
  readonly payment_date: string;

  @IsString()
  readonly payment_time: string;

  @IsNumber()
  readonly price: number;
}
