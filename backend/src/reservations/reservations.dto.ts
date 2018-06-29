import { IsString, IsNumber } from 'class-validator';
export class ReservationsDto {
  @IsNumber() readonly event_id: number;
  @IsString() readonly type: string;
  @IsString() readonly username: string;
  @IsString() readonly address: string;
  @IsString() readonly phone_number: string;
  @IsString() readonly email: string;
  @IsNumber() readonly total_amount: number;
}
