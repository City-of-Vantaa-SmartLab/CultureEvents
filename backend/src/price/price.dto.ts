import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class PriceDto {
  @IsOptional() readonly id: number;
  @IsNumber()
  @ApiModelProperty()
  readonly price: number;

  @IsString()
  @ApiModelProperty()
  readonly ticket_description: string;

  @IsString()
  @ApiModelProperty()
  readonly available_seat_for_this_type: number;
}
