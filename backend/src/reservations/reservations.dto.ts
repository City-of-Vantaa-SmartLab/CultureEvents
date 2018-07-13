import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class ReservationsDto {
  @IsOptional()
  @ApiModelProperty()
  readonly id: number;
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
  @IsOptional()
  @ApiModelProperty()
  readonly classroom: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly phone_number: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly email: string;
  @IsNumber()
  @IsOptional()
  @ApiModelProperty()
  readonly total_amount: number;
}
