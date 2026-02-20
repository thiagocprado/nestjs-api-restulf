/**
 * ==========================================================================
 * USER.SERVICE.TS — Camada de Service (Lógica de Negócio de Usuários)
 * ==========================================================================
 *
 * O que é um Service?
 *   É a camada que contém a LÓGICA DE NEGÓCIO, desacoplada do HTTP.
 *   O Service não sabe que está sendo chamado por um controller HTTP —
 *   ele poderia ser chamado por um WebSocket, CLI, ou teste unitário.
 *
 * Responsabilidades do UserService:
 *   - Criar, buscar, atualizar e deletar usuários
 *   - Buscar usuário por email (usado pelo UniqueEmailValidator)
 *   - Lançar exceções de negócio (NotFoundException)
 *   - Transformar entidades em DTOs de saída
 *
 * POO — Classe com Responsabilidade Única:
 *   Esta classe cuida APENAS de lógica de usuários.
 *   Não sabe nada sobre HTTP, rotas ou validação de entrada.
 * ==========================================================================
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ListUserDTO } from './dto/list-user.dto';

/**
 * @Injectable() — Marca esta classe como um PROVIDER injetável.
 *
 * Sem este decorator, o NestJS não consegue:
 *   1. Criar uma instância desta classe
 *   2. Injetar as dependências do construtor (repository)
 *   3. Disponibilizá-la para injeção em outras classes (controller)
 *
 * Ciclo de vida:
 *   O NestJS cria UMA instância do UserService (singleton por padrão)
 *   e a reutiliza em todas as requisições. Isso é eficiente e seguro
 *   porque o service não guarda estado entre requisições.
 */
@Injectable()
export class UserService {
  /**
   * Injeção de Dependência — Repository do TypeORM:
   *
   * @InjectRepository(UserEntity) é um decorator do @nestjs/typeorm que diz:
   * "injete aqui o Repository<UserEntity> que foi registrado pelo
   *  TypeOrmModule.forFeature([UserEntity]) no UserModule".
   *
   * Repository<UserEntity> é uma classe GENÉRICA do TypeORM que fornece
   * métodos prontos para operações no banco: save(), find(), findOneBy(),
   * delete(), etc. — tudo tipado para UserEntity.
   *
   * Isso é o padrão REPOSITORY: abstrai o acesso ao banco de dados.
   * O service não escreve SQL — usa métodos de alto nível do repository.
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Cria um novo usuário no banco.
   *
   * Object.assign(userEntity, userData as UserEntity):
   *   Copia todas as propriedades do DTO para a entidade.
   *   É um atalho para evitar fazer:
   *     userEntity.name = userData.name;
   *     userEntity.email = userData.email;
   *     userEntity.password = userData.password;
   *
   * repository.save() → insere no banco e retorna a entidade com o ID gerado.
   */
  async createUser(userData: CreateUserDTO) {
    const userEntity = new UserEntity();

    Object.assign(userEntity, userData as UserEntity);

    return this.userRepository.save(userEntity);
  }

  /**
   * Busca todos os usuários e transforma em DTOs de saída.
   *
   * Por que não retornar a entidade diretamente?
   *   Porque UserEntity tem campos sensíveis (password, deletedAt...).
   *   O ListUserDTO expõe APENAS id e name — isso é ENCAPSULAMENTO:
   *   controlar o que é visível externamente.
   */
  async getUsers() {
    const savedUsers = await this.userRepository.find();
    const usersList = savedUsers.map(
      (user) => new ListUserDTO(user.id, user.name),
    );
    return usersList;
  }

  /**
   * Busca um usuário pelo email. Retorna null se não encontrar.
   * Usado internamente pelo UniqueEmailValidator para verificar
   * se o email já está cadastrado.
   */
  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Busca um usuário pelo email, mas LANÇA EXCEÇÃO se não encontrar.
   *
   * Diferença em relação ao findByEmail:
   *   - findByEmail: retorna null (quem chamou decide o que fazer)
   *   - getByEmail:  lança NotFoundException (garante que o usuário existe)
   *
   * NotFoundException é uma exceção HTTP do NestJS que automaticamente
   * retorna status 404 com a mensagem informada.
   */
  async getByEmail(email: string) {
    const user = await this.findByEmail(email);

    if (user === null) throw new NotFoundException('Email not found.');

    return user;
  }

  /**
   * Atualiza parcialmente um usuário.
   *
   * Partial<UpdateUserDTO> → o TypeScript permite que o objeto tenha
   * apenas ALGUNS campos do DTO (não precisa enviar todos).
   *
   * Fluxo: buscar no banco → verificar se existe → copiar novos dados → salvar.
   */
  async updateUser(id: string, newData: Partial<UpdateUserDTO>) {
    const user = await this.userRepository.findOneBy({ id });

    if (user === null) throw new NotFoundException('User not found.');

    Object.assign(user, newData as UserEntity);

    return this.userRepository.save(user);
  }

  /**
   * Remove um usuário do banco (hard delete — remove permanentemente).
   *
   * result.affected indica quantas linhas foram afetadas.
   * Se for 0, o usuário não existe → lança NotFoundException (404).
   */
  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('User not found.');
    }
  }
}
