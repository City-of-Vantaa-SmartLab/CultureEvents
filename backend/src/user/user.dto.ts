import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class UserDto {
  @IsString()
  @ApiModelProperty()
  readonly username: string;
  @IsString()
  @ApiModelProperty()
  password: string;
}
