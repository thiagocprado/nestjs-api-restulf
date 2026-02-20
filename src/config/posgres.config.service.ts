/**
 * ==========================================================================
 * POSGRES.CONFIG.SERVICE.TS — Provider de Configuração do Banco de Dados
 * ==========================================================================
 *
 * Esta classe é um PROVIDER — no NestJS, provider é qualquer classe
 * decorada com @Injectable() que pode ser injetada em outras classes.
 *
 * Responsabilidade: fornecer as configurações de conexão com o PostgreSQL
 * para o TypeOrmModule. Ela também garante que o banco de dados exista
 * antes de tentar conectar.
 *
 * POO — Abstração e Contrato (Interface):
 *   Esta classe IMPLEMENTA a interface TypeOrmOptionsFactory.
 *   Uma interface é um CONTRATO: ela define QUAIS métodos a classe
 *   DEVE ter, mas não diz COMO implementá-los.
 *
 *   TypeOrmOptionsFactory exige o método createTypeOrmOptions().
 *   O TypeOrmModule sabe que pode chamar esse método em qualquer classe
 *   que implemente essa interface — isso é POLIMORFISMO:
 *   "não importa QUAL classe, desde que ela cumpra o contrato".
 *
 * POO — Encapsulamento:
 *   O método ensureDatabaseExists() é PRIVATE — só pode ser chamado
 *   de dentro desta classe. Quem usa PostgresConfigService de fora
 *   não precisa saber (e não consegue acessar) esse detalhe interno.
 *   Isso é encapsulamento: esconder a complexidade interna.
 * ==========================================================================
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Client } from 'pg';

/**
 * @Injectable() — registra esta classe no container de Injeção de Dependência.
 * Sem este decorator, o NestJS não consegue criar nem injetar esta classe.
 *
 * "implements TypeOrmOptionsFactory" → contrato que obriga a classe a ter
 * o método createTypeOrmOptions(). O TypeOrmModule.forRootAsync() espera
 * receber uma classe que cumpra esse contrato (via useClass).
 */
@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  /**
   * Logger — utilitário do NestJS para registrar mensagens no console.
   * "private readonly" significa:
   *   - private: só acessível dentro desta classe (encapsulamento)
   *   - readonly: não pode ser reatribuído após a criação (imutabilidade)
   *
   * O parâmetro PostgresConfigService.name passa o nome da classe para
   * que as mensagens de log mostrem de onde vieram. Exemplo:
   *   [PostgresConfigService] Banco "nestjs_db" já existe.
   */
  private readonly logger = new Logger(PostgresConfigService.name);

  /**
   * Injeção de Dependência via construtor:
   *
   * O NestJS vê que o construtor precisa de um ConfigService e automaticamente
   * injeta a instância que já existe no container (criada pelo ConfigModule).
   *
   * "private readonly configService" é um ATALHO do TypeScript:
   * cria a propriedade this.configService e atribui o valor, tudo em uma linha.
   * Sem o atalho, seria necessário:
   *   private readonly configService: ConfigService;
   *   constructor(configService: ConfigService) {
   *     this.configService = configService;
   *   }
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Método exigido pelo contrato TypeOrmOptionsFactory.
   * O TypeOrmModule chama este método automaticamente durante a inicialização
   * para obter as configurações de conexão com o banco.
   *
   * configService.get<string>('DB_HOST', 'localhost') → lê a variável
   * DB_HOST do .env. Se não existir, usa 'localhost' como padrão.
   *
   * synchronize: true → o TypeORM atualiza o schema do banco automaticamente
   * baseado nas entidades. Útil em desenvolvimento, PERIGOSO em produção.
   *
   * autoLoadEntities: true → carrega automaticamente todas as entidades
   * registradas via TypeOrmModule.forFeature() nos módulos.
   */
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    await this.ensureDatabaseExists();

    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', ''),
      database: this.configService.get<string>('DB_NAME', 'postgres'),
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
      autoLoadEntities: true,
    };
  }

  /**
   * Método PRIVADO (encapsulamento) — só pode ser chamado internamente.
   *
   * Verifica se o banco de dados existe no PostgreSQL. Se não existir,
   * cria automaticamente. Isso evita erros na primeira execução do projeto.
   *
   * Usa o client nativo do PostgreSQL (pg) para conectar ao banco "postgres"
   * (banco padrão que sempre existe) e consultar o catálogo pg_database.
   *
   * O bloco try/catch/finally garante que a conexão seja fechada (client.end())
   * mesmo se ocorrer um erro — boa prática para evitar conexões abertas.
   */
  private async ensureDatabaseExists(): Promise<void> {
    const dbName = this.configService.get<string>('DB_NAME');
    const client = new Client({
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      user: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', ''),
      database: 'postgres',
    });

    try {
      await client.connect();

      const result = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName],
      );

      if (result.rowCount === 0) {
        this.logger.log(`Banco "${dbName}" não existe. Criando...`);
        await client.query(`CREATE DATABASE "${dbName}"`);
      } else {
        this.logger.log(`Banco "${dbName}" já existe.`);
      }
    } catch (error) {
      this.logger.error(
        `Erro ao verificar/criar o banco "${dbName}": ${error}`,
      );
      throw error;
    } finally {
      await client.end();
    }
  }
}
