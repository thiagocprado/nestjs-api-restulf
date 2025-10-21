import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserEntity } from './user.entity';
import { v4 as uuid } from 'uuid';
import { ListUserDTO } from './dto/ListUser.dto';
import { UpdateUserDTO } from './dto/UpdateUser.dto';

@Controller('/users')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    const userEntity = new UserEntity();
    userEntity.name = body.name;
    userEntity.email = body.email;
    userEntity.password = body.password;
    userEntity.id = uuid();

    await this.userRepository.save(userEntity);
    return {
      user: new ListUserDTO(userEntity.id, userEntity.name),
      message: 'Usuário criado com sucesso',
    };
  }

  @Get()
  async getUsers() {
    const data = await this.userRepository.findAll();
    const users = data.map((user) => new ListUserDTO(user.id, user.name));

    return users;
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    const user = await this.userRepository.update(id, body);

    return {
      user,
      message: 'Usuário atualizado com sucesso',
    };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.userRepository.remove(id);

    return {
      user,
      message: 'Usuário deletado com sucesso',
    };
  }
}
