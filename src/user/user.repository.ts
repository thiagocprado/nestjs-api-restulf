import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  private users: UserEntity[] = [];

  async save(user: UserEntity) {
    return this.users.push(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.users;
  }

  private async findById(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<boolean> {
    const exists = this.users.find((user) => user.email === email);
    return exists !== undefined;
  }

  async update(id: string, data: Partial<UserEntity>) {
    const user = await this.findById(id);

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id') return;
      user[key] = value;
    });
    return user;
  }

  async remove(id: string) {
    const user = await this.findById(id);
    this.users = this.users.filter((u) => u.id !== id);

    return user;
  }
}
