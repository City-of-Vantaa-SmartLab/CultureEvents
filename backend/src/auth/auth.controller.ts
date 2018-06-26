import {
  Controller,
  Body,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'user/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'user/user.service';
import { User } from 'user/user.entity';
import { ValidationPipe } from 'validations/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Res() response, @Body() user: UserDto) {
    try {
      const dbUser = await this.userService.findUserByUsernameAndPassword(user);
      if (dbUser) {
        const token = await this.authService.createToken(user);
        const decodedToken = await this.authService.decodeToken(token);
        dbUser.token = token;
        dbUser.token_issued = decodedToken.iat;
        dbUser.token_expiry = decodedToken.exp;
        await this.userService.loginUser(dbUser);
        return response.status(200).send(dbUser);
      } else {
        return response.status(401).send('Authentication Failed');
      }
    } catch (error) {
      return response
        .status(401)
        .send(`Failed to authenticate user ${error.message}`);
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async logout(@Res() response, @Body() user: User) {
    try {
      const dbUser = await this.userService.findUserByUsernameAndPassword(user);
      if (dbUser) {
        const logoutUser = await this.userService.logoutUser(user);
        return response.status(200).send(logoutUser);
      } else {
        return response.status(401).send('Authentication failed');
      }
    } catch (error) {
      return response
        .status(500)
        .send(`Failed to logout user ${error.message}`);
    }
  }
}
