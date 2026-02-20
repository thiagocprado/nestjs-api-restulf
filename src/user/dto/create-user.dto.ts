import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UniqueEmail } from '../validator/unique-email.validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @IsEmail(undefined, { message: 'Invalid email.' })
  @UniqueEmail({ message: 'Email already registered.' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password: string;
}
