import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../shared/interfaces';
import { CreateUserDto, UpdateUserDto } from '../shared/dtos';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '0',
      login: 'User0',
      password: 'password',
      version: 0,
      createdAt: 0,
      updatedAt: 0,
    },
    {
      id: '1',
      login: 'User1',
      password: 'password',
      version: 0,
      createdAt: 0,
      updatedAt: 0,
    }
  ];

  getAll(): Omit<User, 'password'>[] {
    return this.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  getById(id: string): Omit<User, 'password'> | null {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  update(id: string, updateUserDto: UpdateUserDto): Omit<User, 'password'> | null {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return null;

    const user = this.users[userIndex];
    if (user.password !== updateUserDto.oldPassword) {
      throw new Error('Old password is incorrect');
    }

    const updatedUser: User = {
      ...user,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    this.users[userIndex] = updatedUser;
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  delete(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length !== initialLength;
  }
}
