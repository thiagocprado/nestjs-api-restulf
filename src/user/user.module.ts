import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UniqueEmailValidator } from './validator/unique-email.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  // Controllers que expõem rotas HTTP
  controllers: [UserController],
  // Providers disponíveis para DI dentro deste módulo (escopo do módulo)
  providers: [UserService, UserRepository, UniqueEmailValidator],
})
export class UserModule {}
