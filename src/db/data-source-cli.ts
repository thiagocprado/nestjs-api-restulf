/**
 * ==========================================================================
 * DATA-SOURCE-CLI.TS — Configuração do TypeORM para a CLI (fora do NestJS)
 * ==========================================================================
 *
 * Este arquivo existe FORA do contexto do NestJS. Ele é usado exclusivamente
 * pelo CLI do TypeORM para gerar e executar migrations via terminal:
 *
 *   npm run typeorm migration:generate -- -n NomeDaMigration
 *   npm run typeorm migration:run
 *
 * Por que existe separado do PostgresConfigService?
 *   O PostgresConfigService usa o container de DI do NestJS (ConfigService)
 *   para ler variáveis de ambiente. Mas quando rodamos o CLI do TypeORM,
 *   o NestJS NÃO está rodando — não existe container de DI.
 *
 *   Por isso, este arquivo lê as variáveis diretamente com dotenv
 *   e configura o DataSource manualmente.
 *
 * O DataSource é exportado como default para que o CLI do TypeORM
 * consiga encontrá-lo automaticamente (via flag -d no script do package.json).
 * ==========================================================================
 */
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

/** Carrega as variáveis do arquivo .env para process.env */
dotenv.config();

/**
 * Configurações de conexão — mesmas do PostgresConfigService,
 * mas lidas diretamente de process.env (sem ConfigService do NestJS).
 *
 * entities: caminho para encontrar os arquivos de entidade (*.entity.ts)
 * migrations: caminho para encontrar os arquivos de migration
 */
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '..', '**', '*.entity{.js,.ts}')],
  migrations: [path.join(__dirname, 'migrations', '*.{js,ts}')],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
