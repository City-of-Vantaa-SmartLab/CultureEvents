import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { JwtPayload } from 'auth/jwt.payload';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }
  async loginUser(user: User) {
    user.logged_in = true;
    const loginResponse = await this.userRepository.update(user.id, user);
    return loginResponse;
  }

  async createUser(user: UserDto) {
    const hashedPassword = await this.hashPassword(user.password);
    user.password = hashedPassword;
    const response = await this.userRepository.save(user);
    return response;
  }

  async updateUser(id: number, user: UserDto) {
    const hashedPassword = await this.hashPassword(user.password);
    user.password = hashedPassword;
    const response = await this.userRepository.update(id, user);
    return response;
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
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

  async logoutUser(user: UserDto) {
    const dbUser = await this.getUserByUsername(user.username);
    dbUser.logged_in = false;
    await this.userRepository.update({ username: user.username }, dbUser);
    return 'User logged out!';
  }

  async findUserByToken(token: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { username: token.username },
    });
    if (user) {
      const passwordCompare = await this.comparePassword(
        token.password,
        user.password,
      );

      if (passwordCompare) {
        return user;
      } else {
        throw Error('Incorrect credentials');
      }
    }
    return user;
  }

  async findUserByUsernameAndPassword(user: UserDto) {
    const dbUser = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (dbUser) {
      const passwordCompare = await this.comparePassword(
        user.password,
        dbUser.password,
      );
      if (passwordCompare) {
        return dbUser;
      } else {
        throw Error('Incorrect credentials');
      }
    }
    return dbUser;
  }

  async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw Error(`Failed hashing user password: ${error.message}`);
    }
  }

  async comparePassword(password: string, hash: any) {
    try {
      const result = await bcrypt.compare(password, hash);
      return result;
    } catch (error) {
      throw Error(`Password compare failed: ${error.message}`);
    }
  }
}
