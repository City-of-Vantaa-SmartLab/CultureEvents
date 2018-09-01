import { IsString, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class PaymentsDto {
  @IsNumber()
  @ApiModelProperty()
  readonly reservation_id: number;

  @IsString()
  @ApiModelProperty()
  readonly order_number: string;

  @IsString()
  @ApiModelProperty()
  readonly payment_status: boolean;

  @IsString()
  @ApiModelProperty()
  readonly payment_date: string;

  @IsString()
  @ApiModelProperty()
  readonly payment_time: string;

  @IsNumber()
  @ApiModelProperty()
  readonly price: number;
}
