import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { CreateUserDto, UpdateUserDto } from '../shared/dtos';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('User ID is invalid (not uuid)');
    }

    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('User ID is invalid (not uuid)');
    }

    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return {
        id: updatedUser.id,
        login: updatedUser.login,
        version: updatedUser.version,
        createdAt: Number(updatedUser.createdAt),
        updatedAt: Number(updatedUser.updatedAt),
      };
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        throw new ForbiddenException('Old password is wrong');
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('User ID is invalid (not uuid)');
    }

    const result = await this.usersService.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
