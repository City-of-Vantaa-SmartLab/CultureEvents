import {
  Controller,
  Param,
  Post,
  UsePipes,
  Res,
  Body,
  Put,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from 'validations/validation.pipe';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('user')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async create(@Res() response, @Body() user: UserDto) {
    try {
      const existingUser = await this.userService.getUserByUsername(
        user.username,
      );
      if (existingUser) {
        return response
          .status(409)
          .json(`Username already exists in the system.`);
      } else {
        const userCreated = await this.userService.createUser(user);
        return response.status(201).json(userCreated);
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to create user: ${error.message}`);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async update(
    @Res() response,
    @Param('id') id: number,
    @Body() user: UserDto,
  ) {
    try {
      const updateResponse = await this.userService.updateUser(id, user);
      if (updateResponse) {
        return response.status(200).json(updateResponse);
      } else {
        return response
          .status(404)
          .json(`Could not find any users in the system with id: ${id}.`);
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to update user: ${error.message}`);
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUsers(@Res() response) {
    try {
      const users = await this.userService.getUsers();
      if (users) {
        return response.status(200).json(users);
      } else {
        return response
          .status(404)
          .json(`Could not find any users in the system.`);
      }
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to update user: ${error.message}`);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async getUser(@Res() response, @Param('id') id: number) {
    try {
      const user = await this.userService.getUserById(id);
      if (user) {
        return response.status(200).json(user);
      } else {
        return response
          .status(404)
          .json(`Could not find any users in the system with id: ${id}.`);
      }
    } catch (error) {
      return response.status(500).json(`Failed to get user: ${error.message}`);
    }
  }
}
