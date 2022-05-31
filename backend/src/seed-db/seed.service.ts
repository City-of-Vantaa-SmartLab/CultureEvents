import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { users } from './seed_users';
const SEED_DB = process.env.SEED_DB;

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) { }

  async onModuleInit() {
    //await this.seedUsers();
  }

  async seedUsers() {
    try {
      console.log("Seed DB: " + SEED_DB);
      if (SEED_DB) {
        console.log("Seed users:");
        console.log(users);
        const dbUsers = await this.userService.getUsers();
        await Promise.all(
          dbUsers.map(async user => {
            await this.userService.deleteUser(user.id);
          }),
        );

        await Promise.all(
          users.map(async user => {
            user.password = await this.userService.hashPassword(user.password);
          }),
        );
        await this.userRepository.save(users);
      }
    } catch (error) {
      console.error(`Failed to seed users to database ${error.message}`);
    }
  }
}
