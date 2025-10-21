import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UniqueEmail } from '../validator/unique-email.validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsEmail(undefined, { message: 'E-mail inválido' })
  @UniqueEmail({ message: 'E-mail já cadastrado' })
  email: string;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
