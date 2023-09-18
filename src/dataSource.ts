import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT) as number,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['src/**/*{.entity.ts}'],
  migrations: [__dirname + '/src/migrations/*.ts'],
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
});
