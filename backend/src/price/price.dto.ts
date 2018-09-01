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

  @IsNumber()
  @ApiModelProperty()
  readonly max_seats: number;

  @IsNumber()
  @ApiModelProperty()
  readonly occupied_seats: number;
}
