import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Client } from 'pg';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(PostgresConfigService.name);

  constructor(private readonly configService: ConfigService) {}

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
