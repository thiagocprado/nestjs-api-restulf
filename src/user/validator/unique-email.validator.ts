import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from '../user.repository';
import { Injectable } from '@nestjs/common';

@Injectable() // Permite DI do UserRepository
@ValidatorConstraint({ async: true }) // Marca como validator para class-validator (assíncrono)
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  // DI do repositório; resolvido porque o módulo registra UserRepository como provider
  constructor(private userRepository: UserRepository) {}

  // Método chamado pelo class-validator para validar o campo decorado
  async validate(email: string): Promise<boolean> {
    const userExists = await this.userRepository.findByEmail(email);
    return !userExists; // válido se não existir
  }
}

// Factory de decorator custom: @UniqueEmail()
// Usa registerDecorator para ligar a constraint acima à propriedade decorada
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
