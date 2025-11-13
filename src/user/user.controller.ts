import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { v4 as uuid } from 'uuid';
import { ListUserDTO } from './dto/list-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('/users') // Define o prefixo de rota para este controller
export class UserController {
  // Injeção de dependência: UserRepository é resolvido pelo container do Nest
  constructor(private readonly userService: UserService) {}

  @Post() // Rota POST /users
  async createUser(@Body() body: CreateUserDTO) {
    // DTO CreateUserDTO é validado pelo ValidationPipe global
    const userEntity = new UserEntity();
    userEntity.name = body.name;
    userEntity.email = body.email;
    userEntity.password = body.password;
    userEntity.id = uuid();

    await this.userService.createUser(userEntity); // Usa o provider injetado
    return {
      user: new ListUserDTO(userEntity.id, userEntity.name), // Retorna um DTO de listagem
      message: 'Usuário criado com sucesso',
    };
  }

  @Get() // Rota GET /users
  async getUsers() {
    const data = await this.userService.getUsers();
    const users = data.map((user) => new ListUserDTO(user.id, user.name));

    return users;
  }

  @Put('/:id') // Rota PUT /users/:id
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    const user = await this.userService.updateUser(id, body);
    return {
      user,
      message: 'Usuário atualizado com sucesso',
    };
  }

  @Delete('/:id') // Rota DELETE /users/:id
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteUser(id);
    return {
      user,
      message: 'Usuário deletado com sucesso',
    };
  }
}
