import { IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { PriceDto } from '../price/price.dto';
export class EventsDto {
  @IsString() readonly name: string;
  @IsString() readonly location: string;
  @IsString() readonly desciption: string;
  @IsString() readonly event_date: string;
  @IsString() readonly event_time: string;
  @IsArray() readonly ticketCatalog: PriceDto[];
  @IsString() readonly contact_information: string;
  @IsString() readonly event_type: string;
  @IsString() readonly age_group_limit: string;
  @IsBoolean() readonly is_wordless: boolean;
  @IsBoolean() readonly is_bilingual: boolean;
  @IsString() readonly cover_image: string;
  @IsString() readonly theme_color: string;
  @IsString() readonly performer: string;
}
