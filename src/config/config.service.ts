// import * as dotenv from 'dotenv';
// import * as Joi from 'joi';
// export interface DBConfig {
//   uri: string;
// }
//
// export class ConfigService {
//   private readonly envConfig: dotenv.DotenvParseOutput;
//
//   private readonly validationScheme = {
//     APP_PORT: Joi.number().required(),
//     DB_MONGO_URI: Joi.string().required(),
//     JWT_SECRET: Joi.string().required(),
//     JWT_EXPIRATION_TIME: Joi.string().required(),
//   };
//
//   constructor() {
//     const configs: dotenv.DotenvParseOutput[] = [];
//
//     const defaultEnvConfigPath = '.env';
//     const defaultEnvConfig = dotenv.config({ path: defaultEnvConfigPath });
//
//     if (defaultEnvConfig.error) {
//       // tslint:disable-next-line: no-console
//       // console.log(`No config file at path: ${defaultEnvConfigPath}`);
//     } else {
//       configs.push(defaultEnvConfig.parsed);
//       // tslint:disable-next-line: no-console
//       // console.log(`Loaded config file at path: ${defaultEnvConfigPath}`);
//     }
//     this.envConfig = this.validateInput(...configs);
//   }
//
//   get dbConfigMongo(): DBConfig {
//     return {
//       uri: String(this.envConfig.DB_MONGO_URI),
//     };
//   }
//
//   private validateInput(
//     ...envConfig: dotenv.DotenvParseOutput[]
//   ): dotenv.DotenvParseOutput {
//     const mergedConfig: dotenv.DotenvParseOutput = {};
//
//     envConfig.forEach((config) => Object.assign(mergedConfig, config));
//
//     const envVarsSchema: Joi.ObjectSchema = Joi.object(this.validationScheme);
//
//     const result = envVarsSchema.validate(mergedConfig);
//     if (result.error) {
//       throw new Error(`Config validation error: ${result.error.message}`);
//     }
//     return result.value;
//   }
// }
