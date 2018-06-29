import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UserService } from 'user/user.service';
import { UserDto } from 'user/user.dto';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken(user: UserDto) {
    return jwt.sign(user, 'secretKey', { expiresIn: '24h' });
  }

  async validateUser(token: JwtPayload): Promise<any> {
    return await this.userService.findUserByToken(token);
  }

  async decodeToken(token: JwtPayload) {
    return await jwt.decode(token);
  }
}
