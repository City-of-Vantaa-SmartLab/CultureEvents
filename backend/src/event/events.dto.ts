import { IsString, IsNumber } from 'class-validator';
export class EventsDto {
  @IsString() readonly name: string;
  @IsString() readonly type: string;
  @IsString() readonly age_group: string;
  @IsString() readonly desciption: string;
  @IsString() readonly event_date: string;
  @IsString() readonly location: string;
  @IsNumber() readonly child_price: number;
  @IsNumber() readonly adult_price: number;
  @IsNumber() readonly tickets_available: number;
  @IsString() readonly contact_number: string;
}
