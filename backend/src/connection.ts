import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigService } from './config/config.service';

const configService = new ConfigService();

export const connectionDetails: PostgresConnectionOptions = {
  type: "postgres",
  host: configService.databaseHost,
  port: configService.databasePort,
  username: configService.databaseUsername,
  password: configService.databasePassword,
  database: configService.databaseName,
  entities: [`src/**/**.entity{.ts,.js}`],
  synchronize: true
};
