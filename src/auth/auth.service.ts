import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const user = await this.userService.createUser(registerDto);
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await this.userService.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { userId: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}