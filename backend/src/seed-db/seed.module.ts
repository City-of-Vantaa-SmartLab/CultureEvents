import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { User } from 'user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeedService, UserService],
  exports: [SeedService],
})
export class SeedModule {}
