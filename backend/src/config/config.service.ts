import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

export interface EnvConfig {
  [prop: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    try {
      const config = dotenv.parse(fs.readFileSync('.env'));
      this.envConfig = this.validateInput({ ...config, ...process.env });
    } catch (e) {
      this.envConfig = this.validateInput(process.env);
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get applicationPort(): string {
    return this.envConfig.PORT;
  }

  get databaseHost(): string {
    return this.envConfig.DATABASE_HOST;
  }

  get databaseName(): string {
    return this.envConfig.DATABASE_NAME;
  }

  get databasePort(): number {
    return Number(this.envConfig.DATABASE_PORT);
  }

  get databaseUsername(): string {
    return this.envConfig.DATABASE_USERNAME;
  }

  get databasePassword(): string {
    return this.envConfig.DATABASE_PASSWORD;
  }

  get dropDatabaseSchema(): boolean {
    return Boolean(this.envConfig.DROP_DATABASE_SCHEMA === 'true');
  }

  get s3BucketForPictures(): string {
    return this.envConfig.AWS_S3_BUCKET_FOR_PICTURES;
  }

  get awsAccessKeyId(): string {
    return this.envConfig.AWS_ACCESS_KEY_ID;
  }

  get awsSecretAccessKey(): string {
    return this.envConfig.AWS_SECRET_ACCESS_KEY;
  }

  get environment(): string {
    return this.envConfig.NODE_ENV;
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      PORT: Joi.number().default(3000),
      DATABASE_PORT: Joi.number().default(5432),
      DATABASE_HOST: Joi.string().default('localhost'),
      DATABASE_NAME: Joi.string().default('postgres'),
      DATABASE_USERNAME: Joi.string().default('postgres'),
      DATABASE_PASSWORD: Joi.string().default('password'),
      DROP_DATABASE_SCHEMA: Joi.string().default('false'),
      NODE_ENV: Joi.string().allow('local', 'dev', 'test', 'production').default('local'),
      AWS_S3_BUCKET_NAME: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
      { allowUnknown: true }
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
