/**
 * ==========================================================================
 * UPDATE-USER.DTO.TS — DTO de Atualização de Usuário
 * ==========================================================================
 *
 * POO — HERANÇA:
 *   UpdateUserDTO HERDA de CreateUserDTO usando PartialType().
 *
 * O que é PartialType?
 *   É uma função utilitária do @nestjs/mapped-types que:
 *   1. Cria uma NOVA CLASSE que herda todas as propriedades da classe pai
 *   2. Torna TODOS os campos OPCIONAIS (?)
 *   3. MANTÉM todos os decorators de validação
 *
 * Resultado: UpdateUserDTO tem name?, email? e password? (todos opcionais),
 * mas quando enviados, são validados com as mesmas regras do CreateUserDTO.
 *
 * Sem PartialType, seria necessário duplicar todas as validações
 * com @IsOptional() em cada campo. Herança evita repetição de código.
 * ==========================================================================
 */
import { CreateUserDTO } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
