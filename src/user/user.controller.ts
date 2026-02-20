/**
 * ==========================================================================
 * USER.CONTROLLER.TS — Camada de Controller (Usuários)
 * ==========================================================================
 *
 * O que é um Controller?
 *   É a camada que RECEBE requisições HTTP e RETORNA respostas.
 *   O controller NÃO contém lógica de negócio — ele apenas:
 *   1. Recebe os dados da requisição (body, params, query)
 *   2. Delega o processamento para o Service
 *   3. Retorna o resultado ao cliente
 *
 * Fluxo completo de uma requisição POST /users:
 *   Cliente HTTP → NestJS Router → ValidationPipe (valida DTO)
 *   → UserController.createUser() → UserService.createUser()
 *   → Repository.save() → Banco PostgreSQL
 *   → Resposta volta pelo mesmo caminho
 *
 * Arquitetura em Camadas:
 *   Controller (entrada HTTP) → Service (lógica) → Repository (banco)
 *   Cada camada tem UMA responsabilidade. Isso se chama
 *   Princípio da Responsabilidade Única (SRP).
 * ==========================================================================
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { ListUserDTO } from './dto/list-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

/**
 * @Controller('/users') — Decorator que:
 *   1. Marca esta classe como um Controller do NestJS
 *   2. Define '/users' como PREFIXO de todas as rotas desta classe
 *
 * Resultado: todos os métodos abaixo respondem em /users/...
 *   @Post()        → POST   /users
 *   @Get()         → GET    /users
 *   @Put('/:id')   → PUT    /users/:id
 *   @Delete('/:id')→ DELETE /users/:id
 */
@Controller('/users')
export class UserController {
  /**
   * Injeção de Dependência via construtor:
   *
   * "private readonly userService: UserService"
   *   - O NestJS vê que o construtor precisa de um UserService
   *   - Procura no container de DI uma instância de UserService
   *   - Injeta automaticamente (sem precisar de "new UserService()")
   *
   * POO — Encapsulamento:
   *   - private: o service só é acessível dentro desta classe
   *   - readonly: não pode ser reatribuído depois (imutável)
   *
   * Isso significa que o Controller DEPENDE do Service,
   * mas não sabe COMO ele foi criado — isso é responsabilidade do NestJS.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * @Post() — Mapeia este método para requisições POST /users
   *
   * @Body() — Decorator de parâmetro que extrai o CORPO da requisição.
   * O NestJS automaticamente:
   *   1. Pega o JSON do body
   *   2. Converte para uma instância de CreateUserDTO (graças ao transform: true)
   *   3. Valida usando os decorators do class-validator no DTO
   *   4. Se inválido, retorna 400 Bad Request automaticamente
   *   5. Se válido, passa o objeto validado para o parâmetro "userData"
   */
  @Post()
  async createUser(@Body() userData: CreateUserDTO) {
    const createdUser = await this.userService.createUser(userData);

    /**
     * Retorna um ListUserDTO com apenas id e name.
     * Isso é o padrão DTO de saída: controla QUAIS dados são expostos
     * na resposta, evitando vazar dados sensíveis como password.
     */
    return {
      user: new ListUserDTO(createdUser.id, createdUser.name),
      message: 'User created successfully.',
    };
  }

  /** @Get() — Mapeia para GET /users. Retorna a lista de todos os usuários. */
  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  /**
   * @Put('/:id') — Mapeia para PUT /users/:id (atualização completa)
   *
   * @Param('id') — Extrai o parâmetro ":id" da URL.
   *   Exemplo: PUT /users/abc-123 → id = "abc-123"
   *
   * @Body() — Extrai o corpo da requisição como UpdateUserDTO.
   *   UpdateUserDTO usa PartialType, então todos os campos são opcionais.
   */
  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    const updatedUser = await this.userService.updateUser(id, body);

    return {
      user: updatedUser,
      message: 'User updated successfully.',
    };
  }

  /**
   * @Delete('/:id') — Mapeia para DELETE /users/:id
   * Remove o usuário pelo ID. O service lança NotFoundException se não existir.
   */
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);

    return {
      message: 'User removed successfully.',
    };
  }
}
