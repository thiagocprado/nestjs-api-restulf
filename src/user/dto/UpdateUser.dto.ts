import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UniqueEmail } from '../validator/unique-email.validator';

export class UpdateUserDTO {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsOptional()
  name: string;

  @IsEmail(undefined, { message: 'E-mail inválido' })
  @UniqueEmail({ message: 'E-mail já cadastrado' })
  @IsOptional()
  email: string;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @IsOptional()
  password: string;
}
