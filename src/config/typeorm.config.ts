import { TypeOrmModuleOptions } from '@nestjs/typeorm';

let config: TypeOrmModuleOptions = null;

function createConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.js'],
    synchronize: true,
  };
}

/**
 * Get TypeOrm Module Options.
 * @returns TypeOrm Module Options
 */
export function getTypeOrmModuleOptions(): TypeOrmModuleOptions {
  if (!config) {
    config = createConfig();
  }
  return config;
}
