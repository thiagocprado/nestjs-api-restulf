import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: UserEntity) {
    return await this.userRepository.save(user);
  }

  async getUsers() {
    return await this.userRepository.find();
  }

  async updateUser(id: string, user: Partial<UpdateUserDTO>) {
    await this.userRepository.update(id, user);
    return await this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.delete(id);
    }
    return user;
  }
}
