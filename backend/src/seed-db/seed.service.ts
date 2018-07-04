import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository, Connection } from 'typeorm';
const seed_users = require('../seed-db/seed_users.json');
const SEED_DB = process.env.SEED_DB;

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async seedUsers() {
    try {
      if (SEED_DB) {
        await this.connection.synchronize(true);
        await this.userRepository.save(seed_users);
      }
    } catch (error) {
      console.log(`Failed to seed users to database ${error.message}`);
    }
  }
}
