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
  readonly customer_type: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly name: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly school_name: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly class: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly phone: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly email: string;
}
