/**
 * ==========================================================================
 * UNIQUE-EMAIL.VALIDATOR.TS — Validator Customizado com Injeção de Dependência
 * ==========================================================================
 *
 * Este arquivo contém UM DOS CONCEITOS MAIS AVANÇADOS do projeto:
 * um DECORATOR DE VALIDAÇÃO CUSTOMIZADO que acessa o banco de dados.
 *
 * Funciona assim:
 *   1. O DTO CreateUserDTO usa @UniqueEmail() no campo email
 *   2. O ValidationPipe aciona o UniqueEmailValidator
 *   3. O UniqueEmailValidator usa o UserService (injetado via DI)
 *      para consultar o banco e verificar se o email já existe
 *   4. Se já existe, retorna false → validação falha → erro 400
 *
 * Para isso funcionar, 3 coisas são necessárias:
 *   - UniqueEmailValidator deve ser @Injectable() (provider no container de DI)
 *   - UniqueEmailValidator deve estar em providers[] do UserModule
 *   - useContainer() deve ser chamado no main.ts (conecta class-validator ao DI)
 *
 * POO — Interface/Contrato:
 *   ValidatorConstraintInterface exige o método validate().
 *   O class-validator sabe chamar esse método em qualquer classe
 *   que implemente essa interface.
 * ==========================================================================
 */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';

/**
 * @Injectable() — Registra no container de DI do NestJS.
 *   Necessário para que o UserService seja injetado no construtor.
 *
 * @ValidatorConstraint({ async: true }) — Registra no class-validator.
 *   async: true indica que o método validate() é assíncrono
 *   (precisa esperar a consulta ao banco).
 *
 * Perceba: esta classe tem DOIS decorators — um do NestJS (@Injectable)
 * e outro do class-validator (@ValidatorConstraint). Ela vive nos dois mundos.
 */
@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  /**
   * UserService é injetado via DI. Isso só funciona porque:
   *   1. Esta classe está em providers[] do UserModule
   *   2. useContainer() no main.ts conectou o class-validator ao container
   */
  constructor(private userService: UserService) {}

  /**
   * Método exigido pelo contrato ValidatorConstraintInterface.
   * Retorna true = válido (email não existe), false = inválido (email já existe).
   */
  async validate(email: string): Promise<boolean> {
    const userExists = await this.userService.findByEmail(email);
    return !userExists;
  }
}

/**
 * UniqueEmail — FACTORY DE DECORATORS (função que cria um decorator).
 *
 * O que é uma factory de decorators?
 *   É uma função que RETORNA um decorator. Usada quando o decorator
 *   precisa receber parâmetros (neste caso, options com a mensagem de erro).
 *
 * UniqueEmail({ message: 'Email já cadastrado' }) retorna um decorator
 * que, quando aplicado a uma propriedade, registra o UniqueEmailValidator
 * como validador daquele campo.
 *
 * registerDecorator() é a função do class-validator que conecta:
 *   - target: a classe dona da propriedade (CreateUserDTO)
 *   - propertyName: o nome do campo ('email')
 *   - validator: a classe que faz a validação (UniqueEmailValidator)
 *   - options: configurações como a mensagem de erro
 */
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
