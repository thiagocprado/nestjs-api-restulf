import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UniqueEmail } from '../validator/unique-email.validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'O nome é obrigatório' }) // valida presença
  name: string;

  @IsEmail(undefined, { message: 'E-mail inválido' }) // valida formato
  @UniqueEmail({ message: 'E-mail já cadastrado' }) // valida regra de negócio via validator custom
  email: string;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' }) // valida tamanho
  password: string;
}
