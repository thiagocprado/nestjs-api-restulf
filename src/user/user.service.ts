import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ListUserDTO } from './dto/list-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userData: CreateUserDTO) {
    const userEntity = new UserEntity();

    Object.assign(userEntity, userData as UserEntity);

    return this.userRepository.save(userEntity);
  }

  async getUsers() {
    const savedUsers = await this.userRepository.find();
    const usersList = savedUsers.map(
      (user) => new ListUserDTO(user.id, user.name),
    );
    return usersList;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async getByEmail(email: string) {
    const user = await this.findByEmail(email);

    if (user === null) throw new NotFoundException('Email not found.');

    return user;
  }

  async updateUser(id: string, newData: Partial<UpdateUserDTO>) {
    const user = await this.userRepository.findOneBy({ id });

    if (user === null) throw new NotFoundException('User not found.');

    Object.assign(user, newData as UserEntity);

    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('User not found.');
    }
  }
}
