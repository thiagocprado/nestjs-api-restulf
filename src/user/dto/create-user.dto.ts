/**
 * ==========================================================================
 * CREATE-USER.DTO.TS — DTO de Criação de Usuário (Contrato de Entrada)
 * ==========================================================================
 *
 * O que é um DTO (Data Transfer Object)?
 *   É uma classe que define a FORMA dos dados que a API aceita.
 *   Funciona como um CONTRATO DE ENTRADA: descreve quais campos
 *   são obrigatórios, seus tipos e regras de validação.
 *
 * Os decorators de validação vêm da biblioteca class-validator.
 * O ValidationPipe (configurado no main.ts) aplica essas regras
 * automaticamente antes de o controller receber os dados.
 *
 * Se alguma regra for violada, o NestJS retorna 400 Bad Request
 * com as mensagens de erro configuradas em cada decorator.
 * ==========================================================================
 */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UniqueEmail } from '../validator/unique-email.validator';

export class CreateUserDTO {
  /**
   * @IsNotEmpty() — Valida que o campo não é vazio (não é "", null ou undefined).
   * O objeto { message: '...' } define a mensagem de erro customizada.
   */
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  /**
   * @IsEmail() — Valida que o valor é um email válido (formato x@y.z).
   *
   * @UniqueEmail() — Decorator CUSTOMIZADO (criado neste projeto).
   * Consulta o banco de dados para verificar se o email já está cadastrado.
   * Se já existir, retorna erro de validação com a mensagem configurada.
   *
   * Este é um exemplo avançado de como o NestJS permite criar
   * validações que acessam o banco de dados através da DI.
   * Veja o arquivo unique-email.validator.ts para entender como funciona.
   */
  @IsEmail(undefined, { message: 'Invalid email.' })
  @UniqueEmail({ message: 'Email already registered.' })
  email: string;

  /**
   * @MinLength(6) — Valida que a string tem pelo menos 6 caracteres.
   * Isso é uma regra de negócio: senhas muito curtas são inseguras.
   */
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password: string;
}
