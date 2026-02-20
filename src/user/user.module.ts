import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UniqueEmailValidator } from './validator/unique-email.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UniqueEmailValidator],
})
export class UserModule {}
