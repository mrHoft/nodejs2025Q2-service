import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { UpdateUserDto } from 'src/shared/dtos';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import 'dotenv/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(parseInt(process.env.CRYPT_SALT));
    return bcrypt.hash(password, salt);
  }

  async findAll(): Promise<User[]> {
    console.log('Get users');
    return this.userRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login } });
  }

  async create(createUserDto: { login: string; password: string }): Promise<User> {
    console.log(`Create user ${createUserDto.login}`);
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user).catch(async error => {
      console.log(error.message);
      if (error instanceof QueryFailedError) {
        console.log(error.driverError.detail);
        if (error.driverError.code === '23505') {
          return await this.userRepository.findOne({ where: { login: createUserDto.login } });
        }
      }
      return null;
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    console.log(`Update user ${id}`);
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isPasswordValid = await bcrypt.compare(updateUserDto.oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.password = await this.hashPassword(updateUserDto.newPassword);
    user.version += 1;
    user.updatedAt = Date.now();

    return this.userRepository.save(user);
  }

  async delete(id: string) {
    console.log(`Delete user ${id}`);
    return await this.userRepository.delete(id);
  }
}
