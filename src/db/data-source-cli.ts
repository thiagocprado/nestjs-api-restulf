import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

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
