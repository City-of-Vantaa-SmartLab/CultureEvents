import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository, Connection } from 'typeorm';
import { UserService } from 'user/user.service';
const seed_users = require('../seed-db/seed_users.json');
const SEED_DB = process.env.SEED_DB;

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async seedUsers() {
    try {
      if (SEED_DB) {
        await Promise.all(
          seed_users.map(async user => {
            user.password = await this.userService.hashPassword(user.password);
          }),
        );
        await this.connection.synchronize(true);
        await this.userRepository.save(seed_users);
      }
    } catch (error) {
      console.log(`Failed to seed users to database ${error.message}`);
    }
  }
}
