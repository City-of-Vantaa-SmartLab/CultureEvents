import { IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class TicketsDto {
  @IsNumber()
  @ApiModelProperty()
  readonly price_id: number;
  @IsNumber()
  @ApiModelProperty()
  readonly no_tickets: number;
}
