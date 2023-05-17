import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Profile } from './entity/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]), // Import repositories
  ],
  controllers: [UserController], // Include the UserController
  providers: [UserService], // Include the UserService
  exports:[UserService]
})
export class UserModule {}