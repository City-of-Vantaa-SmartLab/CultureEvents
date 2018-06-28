import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { JwtPayload } from 'auth/jwt.payload';
import { User } from './user.entity';
import { AuthService } from 'auth/auth.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async loginUser(user: User) {
    user.logged_in = true;
    const loginResponse = await this.userRepository.update(user.id, user);
    return loginResponse;
  }

  async createUser(user: UserDto) {
    const response = await this.userRepository.save(user);
    return response;
  }

  async updateUser(id: number, user: User) {
    const response = await this.userRepository.update(id, user);
    return response;
  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async logoutUser(user: User) {
    user.logged_in = false;
    await this.userRepository.update({ username: user.username }, user);
    return 'User logged out!';
  }

  async findUserByToken(token: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { username: token.username, password: token.password },
    });
    return user;
  }

  async findUserByUsernameAndPassword(user: UserDto) {
    const dbUser = await this.userRepository.findOne({
      where: { username: user.username, password: user.password },
    });
    return dbUser;
  }
}
