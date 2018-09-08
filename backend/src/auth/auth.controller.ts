import {
  Controller,
  Body,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../user/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { ValidationPipe } from '../validations/validation.pipe';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Res() response, @Body() user: UserDto) {
    try {
      const dbUser = await this.userService.findUserByUsernameAndPassword(user);
      if (dbUser) {
        let token = dbUser.token;
        if (token == null || dbUser.token_expiry < Date.now() / 1000) {
          const newToken = await this.authService.createToken(user);
          const decodedToken = await this.authService.decodeToken(newToken);
          dbUser.token = newToken;
          dbUser.token_issued = decodedToken.iat;
          dbUser.token_expiry = decodedToken.exp;
        }
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
  async logout(@Res() response, @Body() user: UserDto) {
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
