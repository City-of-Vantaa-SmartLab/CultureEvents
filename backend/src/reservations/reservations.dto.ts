import { IsString, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class ReservationsDto {
  @IsNumber()
  @ApiModelProperty()
  readonly event_id: number;
  @IsString()
  @ApiModelProperty()
  readonly type: string;
  @IsString()
  @ApiModelProperty()
  readonly username: string;
  @IsString()
  @ApiModelProperty()
  readonly address: string;
  @IsString()
  @ApiModelProperty()
  readonly phone_number: string;
  @IsString()
  @ApiModelProperty()
  readonly email: string;
  @IsNumber()
  @ApiModelProperty()
  readonly total_amount: number;
}
