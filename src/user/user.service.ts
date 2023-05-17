import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { hashSync, compareSync } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName, age } = registerDto;

    const hashedPassword = hashSync(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: 'user',
      profile: {
        firstName,
        lastName,
        age,
      },
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return compareSync(plainPassword, hashedPassword);
  }

  async getUser(id: number): Promise<User> {
    return this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('user.id = :id', { id })
            .getOne();
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // await this.userRepository.update(id, updateUserDto);
    // return this.userRepository.findOne(id);
    const updatedUser = plainToClass(User, updateUserDto);
    return this.userRepository.update(id, updatedUser).then(() => this.getUser(id));
  
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}