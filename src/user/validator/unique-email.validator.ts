import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from '../user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private userRepository: UserRepository) {}

  async validate(email: string): Promise<boolean> {
    const userExists = await this.userRepository.findByEmail(email);
    return !userExists;
  }
}

export const UniqueEmail = (options: ValidationOptions) => {
  return (obj: object, propertyName: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options,
      constraints: [],
      validator: UniqueEmailValidator,
    });
  };
};
