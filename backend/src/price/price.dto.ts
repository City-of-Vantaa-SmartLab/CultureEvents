import { IsString, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class PriceDto {
  @IsNumber()
  @ApiModelProperty()
  readonly price: number;

  @IsString()
  @ApiModelProperty()
  readonly ticket_type: string;

  @IsString()
  @ApiModelProperty()
  readonly ticket_description: string;

  @IsString()
  @ApiModelProperty()
  readonly available_seat_for_this_type: number;
}
