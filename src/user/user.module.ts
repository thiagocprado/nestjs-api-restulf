/**
 * ==========================================================================
 * USER.MODULE.TS — Módulo de Usuários
 * ==========================================================================
 *
 * Este módulo encapsula tudo relacionado ao domínio de USUÁRIOS:
 * controller, service, entidade e validator.
 *
 * No NestJS, cada módulo é uma "caixa fechada" que agrupa funcionalidades
 * relacionadas. Isso segue o princípio de COESÃO: tudo sobre usuários
 * fica junto no UserModule.
 *
 * Estrutura interna:
 *   imports:     → repositórios de banco (TypeOrmModule.forFeature)
 *   controllers: → classes que recebem requisições HTTP
 *   providers:   → classes com lógica de negócio e validação
 * ==========================================================================
 */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UniqueEmailValidator } from './validator/unique-email.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Module({
  /**
   * TypeOrmModule.forFeature([UserEntity]):
   *
   * Padrão forFeature — usado nos módulos de funcionalidade (feature modules)
   * para registrar QUAIS entidades este módulo usa.
   *
   * Ao registrar UserEntity aqui, o TypeORM cria automaticamente um
   * Repository<UserEntity> e o disponibiliza para injeção neste módulo.
   * É por isso que o UserService consegue usar @InjectRepository(UserEntity).
   *
   * Diferença entre forRoot e forFeature:
   *   - forRoot:    configura o módulo UMA vez na raiz (conexão com banco)
   *   - forFeature: registra entidades específicas em cada módulo
   */
  imports: [TypeOrmModule.forFeature([UserEntity])],

  /**
   * controllers — classes que definem rotas HTTP.
   * O NestJS lê os decorators (@Get, @Post, etc.) do UserController
   * e registra as rotas automaticamente.
   */
  controllers: [UserController],

  /**
   * providers — classes injetáveis disponíveis DENTRO deste módulo.
   *
   * UserService: contém a lógica de negócio de usuários.
   * UniqueEmailValidator: validator customizado que consulta o banco
   *   para verificar se o email já existe (usa o UserService internamente).
   *
   * Esses providers só são acessíveis dentro do UserModule.
   * Para compartilhá-los com outros módulos, seria preciso adicioná-los
   * ao array "exports".
   */
  providers: [UserService, UniqueEmailValidator],
})
export class UserModule {}
