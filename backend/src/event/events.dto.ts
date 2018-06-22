import { IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { PriceDto } from '../price/price.dto';
export class EventsDto {
  @IsString() readonly name: string;
  @IsString() readonly type: string;
  @IsString() readonly age_group: string;
  @IsString() readonly desciption: string;
  @IsString() readonly event_date: string;
  @IsString() readonly location: string;
  @IsArray() readonly pricing: PriceDto[];
  @IsNumber() readonly tickets_available: number;
  @IsString() readonly contact_info: string;
  @IsString() readonly performer: string;
  @IsBoolean() readonly bilingual: boolean;
  @IsBoolean() readonly wordless: boolean;
}
