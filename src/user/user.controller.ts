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
import { ListUserDTO } from './dto/list-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: CreateUserDTO) {
    const createdUser = await this.userService.createUser(userData);

    return {
      user: new ListUserDTO(createdUser.id, createdUser.name),
      message: 'User created successfully.',
    };
  }

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    const updatedUser = await this.userService.updateUser(id, body);

    return {
      user: updatedUser,
      message: 'User updated successfully.',
    };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);

    return {
      message: 'User removed successfully.',
    };
  }
}
